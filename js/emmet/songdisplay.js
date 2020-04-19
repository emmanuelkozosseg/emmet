define(['emmet/notifier', 'emmet/songdata', 'emmet/songplayer', 'emmet/utils', 'mustache'],
function(emmetNotifier, emmetSongData, emmetSongPlayer, emmetUtils, mustache) {
    var currentlyDisplayedSong = null;
    var currentlyDisplayedLang = null;
    var repeatVerses = false;
    
    var rerenderLyrics = function() {
        if (repeatVerses && 'order' in currentlyDisplayedLang) {
            var verses = currentlyDisplayedLang.order.map(verseName => currentlyDisplayedLang.verses.find(v => v.name == verseName));
        } else {  // "once" OR ("repeat" AND order is not defined)
            var verses = currentlyDisplayedLang.verses;
        }
        var lyricsHtml = mustache.to_html(emmetUtils.getTemplate("songlyrics"), verses);
        $("#emmet-song-lyrics").html(lyricsHtml);
    };

    var changeLanguage = function(newLangId) {
        currentlyDisplayedLang = currentlyDisplayedSong.lyrics[newLangId];
        rerenderLyrics();

        // Set modal title
        $("#emmet-song-modal .emmet-song-title").text(currentlyDisplayedLang.title);

        // Update language menu
        $("#emmet-song-modal div.emmet-song-toolbar .emmet-lang-btn img.flag")
                .removeClass().addClass("flag flag-"+emmetUtils.getCountryOfLang(currentlyDisplayedLang.lang));
        $("#emmet-song-modal div.emmet-song-toolbar .emmet-lang-btn span.emmet-langname").text(currentlyDisplayedLang.lang);

        // Hide currently selected from menu
        $("#emmet-song-modal div.emmet-song-toolbar a.dropdown-item").show();
        $("#emmet-song-modal div.emmet-song-toolbar a.dropdown-item.emmet-song-lang-select-"+newLangId).hide();
    };

    var getCopyrightString = function(about_obj) {
        if (! about_obj) {return null;}
        var hasHolder = 'c_holder' in about_obj;
        var hasYear = 'c_year' in about_obj;
        if (hasHolder) {
            return "© " + about_obj.c_holder + (hasYear ? ", "+about_obj.c_year : "");
        } else if (hasYear) {
            return "© " + about_obj.c_year;
        } else {
            return null;
        }
    };

    var displaySongByInternalId = function(internalSongId, langId) {
        var song = emmetSongData.getAllSongs()[internalSongId];
        currentlyDisplayedSong = song;

        // If no language is requested, fall back to the main language
        if (langId === undefined) {
            langId = emmetSongData.getMainLangIdOfSong(song);
        }

        // Prepare list of available languages
        var languages = song.lyrics.map((songInLang, index) => {
            var country = emmetUtils.getCountryOfLang(songInLang.lang);
            return {
                'id': index,
                'name': songInLang.lang,
                'title': songInLang.title,
                'country': country === undefined ? '?' : country,
            };
        });

        // Prepare list of books
        var books = song.books.map(book => {
            return {
                'name': emmetSongData.getBook(book.id).name,
                'number': book.number,
            };
        });

        // Prepare list of records
        if (song.records) {
            var records = song.records.map(record => {
                var purposeDetails = emmetUtils.getRecordPurposeDetails(record.purpose);
                return {
                    'url': record.url,
                    'purposeIcon': purposeDetails['icon'],
                    'purposeName': purposeDetails['name'],
                    'purposeDesc': purposeDetails['desc'],
                    'country': emmetUtils.getCountryOfLang(record.lang), 'lang': record.lang,
                    'note': record.note || '',
                };
            });
        }

        var songInBook = song.books.find(function(b) {return b.id == emmetSongData.getCurrentBook().id});
        var currentNumber = songInBook===undefined ? undefined : songInBook.number;

        // Prepare view object for Mustache and generate HTML
        var displaySong = {
            'currentNumber': currentNumber,
            'languages': languages,
            'isSingleLanguage': languages.length == 1,
            'books': books,
            'song': song,
            'records': records,
            'hasFormerNumbers': 'former_numbers' in songInBook,
            'formerNumbers': songInBook.former_numbers,
            'origCopyright': getCopyrightString(song.about),
            'translationCopyright': song.lyrics
                                        .map(l => ({
                                            'langName': l.lang, 'langCountry': emmetUtils.getCountryOfLang(l.lang),
                                            'adaptedBy': l.about ? l.about.adapted_by : null,
                                            'copyright': l.about ? getCopyrightString(l.about) : null,
                                        })),
            'repeatVerses': repeatVerses,
        };
        var songHtml = mustache.to_html(emmetUtils.getTemplate("song"), displaySong);
        $("#emmet-song-modal .modal-content").html(songHtml);

        // Set up bindings
        $("#emmet-song-modal .emmet-song-lang-select a.dropdown-item").click(function(e) {
            e.preventDefault();
            changeLanguage($(this).data("langid"));
        });
        $("#emmet-song-modal .emmet-song-toolbar a.nav-link[data-toggle='tab']").on("show.bs.tab", function(e) {
            $(this).tooltip('hide');
        });
        $("#emmet-song-modal .emmet-song-verse-display-mode").click(function(e) {
            e.preventDefault();
            repeatVerses = $(this).data("mode") == "repeat";
            rerenderLyrics();
            // Move checkmark
            $(this).parent().find(".emmet-song-verse-display-mode span.oi-check").removeClass("oi-check");
            $(this).children("span.oi").addClass("oi-check");
        });
        if (song.records) {
            // Create songplayer
            var songPlayer = emmetSongPlayer.create($("#emmet-song-modal .emmet-song-player-container"));
            // Toolbar button
            $("#emmet-song-modal .emmet-song-play-btn a.nav-link").removeClass("disabled");
            // Record selector
            $("#emmet-song-modal .emmet-song-records a.emmet-song-record").click(function(e) {
                songPlayer.play($(this).data("url"));
                $(this).parent().children().removeClass("active");
                $(this).addClass("active").blur();
                e.preventDefault();
            });
            // Stop playing on dialog close
            $('#emmet-song-modal').on('hidden.bs.modal', function() {
                songPlayer.destroy();
            });
        } else {
            $("#emmet-song-modal .emmet-song-play-btn a.nav-link").addClass("disabled");
        }
        $('#emmet-song-modal div.emmet-song-toolbar a.nav-link').tooltip({"placement": "bottom"});

        changeLanguage(langId);
        $("#emmet-song-modal").modal();
    };

    return {
        displaySong: function(songId) {
            var songBook = emmetSongData.getCurrentBook();
            var songIdLc = songId.toLowerCase();
            if (! songBook.songs.hasOwnProperty(songIdLc)) {
                emmetNotifier.showError(
                        "Hiányzó ének",
                        "Nincs <strong>"+songId+"</strong>. számú ének a kiválasztott énekeskönyvben ("+songBook.name+").");
                return;
            }
            displaySongByInternalId(songBook.songs[songIdLc].internalId);
        },

        displaySongByInternalId: displaySongByInternalId,
    };
});