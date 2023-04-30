define(['emmet/config', 'emmet/notifier', 'emmet/songdata', 'emmet/songplayer', 'emmet/utils', 'mustache'],
function(emmetConfig, emmetNotifier, emmetSongData, emmetSongPlayer, emmetUtils, mustache) {
    const CONFIG_VDISPLAYMODE = "song-verse-display-mode";
    const CONFIG_FONTSIZE = "song-font-size";
    
    const FONT_SIZES = ["s", "m", "l", "xl", "xxl"];

    var currentlyDisplayedSong = null;
    var currentlyDisplayedLang = null;

    emmetConfig.configureSettings({
        [CONFIG_VDISPLAYMODE]: "once",
        [CONFIG_FONTSIZE]: "m"
    });

    var rerenderLyrics = function() {
        if (emmetConfig.get(CONFIG_VDISPLAYMODE) == "repeat" && 'order' in currentlyDisplayedLang) {
            var verses = currentlyDisplayedLang.order.map(verseName => currentlyDisplayedLang.verses.find(v => v.name == verseName));
        } else {  // "once" OR ("repeat" AND order is not defined)
            var verses = currentlyDisplayedLang.verses;
        }
        var lyricsHtml = mustache.to_html(emmetUtils.getTemplate("songlyrics"), {
            'verses': verses,
            'isLiteral': currentlyDisplayedLang.isLiteral
        });
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

    var switchToSongRelative = function(offset) {
        let numOfSongsInBook = emmetSongData.getCurrentBook().songsInOrder.length;
        let currentSongIndex = emmetSongData.getCurrentBook().songsInOrder.findIndex(s => s.internalId == currentlyDisplayedSong.internalId);
        let newSongIndex = (currentSongIndex + offset) % numOfSongsInBook;
        if (newSongIndex < 0) {newSongIndex += numOfSongsInBook;}

        displaySongByInternalId(emmetSongData.getCurrentBook().songsInOrder[newSongIndex].internalId, {dontShowModal: true});
    }

    var showSwitchSongDialog = function() {
        $("#emmet-song-change-modal .modal-content").html(emmetUtils.getTemplate("songchange"));

        $("#emmet-song-change-modal .emmet-songch").click(function(e) {
            switchToSongRelative(parseInt($(this).data("offset")));
        });

        $("#emmet-song-change-modal").modal();
    }

    var handleKeyDown = function(e) {
        if (e.key == "ArrowLeft") {switchToSongRelative(-1);}
        if (e.key == "ArrowRight") {switchToSongRelative(1);}
    };

    var displaySongByInternalId = function(internalSongId, options={}) {
        var song = emmetSongData.getAllSongs()[internalSongId];
        currentlyDisplayedSong = song;

        // If no language is requested, fall back to the main language
        if (! ('langId' in options)) {
            options.langId = emmetSongData.getMainLangIdOfSong(song);
        }

        // Prepare list of available languages
        var languages = song.lyrics.map((songInLang, index) => {
            var country = emmetUtils.getCountryOfLang(songInLang.lang);
            return {
                'id': index,
                'name': songInLang.lang,
                'isLiteral': songInLang.isLiteral,
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
            'origLangCountry': ('about' in song && 'orig_lang' in song.about) ? emmetUtils.getCountryOfLang(song.about.orig_lang) : null,
            'translationCopyright': song.lyrics
                                        // If the original language is known, don't display its translation copyright
                                        .filter(l => ('about' in song && 'orig_lang' in song.about) ? song.about.orig_lang != l.lang : true)
                                        .map(l => ({
                                            'langName': l.lang, 'langCountry': emmetUtils.getCountryOfLang(l.lang),
                                            'adaptedBy': l.about ? l.about.adapted_by : null,
                                            'copyright': l.about ? getCopyrightString(l.about) : null,
                                        })),
            'repeatVerses': emmetConfig.get(CONFIG_VDISPLAYMODE) == "repeat",
            'activeFontSize': emmetConfig.get(CONFIG_FONTSIZE),
            'fontSizes': FONT_SIZES.map(size => ({
                'size': size, 'sizeUpper': size.toUpperCase(),
                'isActive': emmetConfig.get(CONFIG_FONTSIZE) == size
            }))
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
            emmetConfig.set(CONFIG_VDISPLAYMODE, $(this).data("mode"));
            rerenderLyrics();
            // Move checkmark
            $(this).parent().find(".emmet-song-verse-display-mode span.oi-check").removeClass("oi-check");
            $(this).children("span.oi").addClass("oi-check");
        });
        $("input[type=radio][name=emmet-font-size]").change(function() {
            emmetConfig.set(CONFIG_FONTSIZE, this.value);
            $("#emmet-song-lyrics").removeClass(function(index, className) {
                return (className.match (/(^|\s)emmet-song-size-\S+/g) || []).join(' ');
            }).addClass("emmet-song-size-"+this.value);
        });
        $("#emmet-song-modal .emmet-song-ch-btn").click(function(e) {
            e.preventDefault();
            showSwitchSongDialog();
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
        $(document).off("keydown", handleKeyDown).on("keydown", handleKeyDown);
        $('#emmet-song-modal').on('hidden.bs.modal', function() {$(document).off("keydown", handleKeyDown);});

        changeLanguage(options.langId);
        if (! options.dontShowModal) {
            $("#emmet-song-modal").modal();
        }
    };

    return {
        displaySong: function(songId) {
            var songBook = emmetSongData.getCurrentBook();
            var songIdLc = songId.toLowerCase().trim();
            if (! songIdLc) {
                throw {name: "empty", message: "Hiányzó énekszám!"};
            }
            if (! songBook.songs.hasOwnProperty(songIdLc)) {
                throw {name: "missing", message: "Ismeretlen énekszám!"};
            }
            displaySongByInternalId(songBook.songs[songIdLc].internalId);
        },

        displaySongByInternalId: displaySongByInternalId,
    };
});