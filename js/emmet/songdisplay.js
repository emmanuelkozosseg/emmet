define(['bootstrap', 'emmet/config', 'emmet/router', 'emmet/songdata', 'emmet/songplayer', 'emmet/utils', 'jquery', 'mustache'],
function(bootstrap, emmetConfig, emmetRouter, emmetSongData, emmetSongPlayer, emmetUtils, _j, mustache) {
    const CONFIG_VDISPLAYMODE = "song-verse-display-mode";
    const CONFIG_FONTSIZE = "song-font-size";
    
    const FONT_SIZES = ["s", "m", "l", "xl", "xxl"];

    var currentlyDisplayedSong = null;
    var currentlyDisplayedLang = null;
    var currentSongPlayer = null;

    emmetConfig.configureSettings({
        [CONFIG_VDISPLAYMODE]: "once",
        [CONFIG_FONTSIZE]: "m"
    });

    // Warn on dialog close if player is playing
    var closeConfirmed = false;
    $("#emmet-song-modal").on("hide.bs.modal", function(e) {
        if (closeConfirmed || currentSongPlayer === null || !currentSongPlayer.isPlaying()) {
            return;
        }
        var confirmModalElement = document.querySelector("#emmet-song-playing-warn-modal .modal-content");
        confirmModalElement.innerHTML = emmetUtils.getTemplate("songplayingconfirm");
        document.getElementById("emmet-song-change-modal-yes-btn").addEventListener("click", () => {
            closeConfirmed = true;
            ["emmet-song-playing-warn-modal", "emmet-song-modal"].forEach(it => {
                bootstrap.Modal.getInstance(document.getElementById(it)).hide();
            });
        });
        bootstrap.Modal.getOrCreateInstance("#emmet-song-playing-warn-modal").show();
        e.preventDefault();
    });
    // Stop playing on dialog close
    $('#emmet-song-modal').on('hidden.bs.modal', function() {
        currentSongPlayer?.destroy();
        closeConfirmed = false;
        if (emmetRouter.getCurrentRoute()?.page == "song") {
            emmetRouter.closeOverlay();
        }
    });
    // Remove keyboard events when modal is closed 
    $('#emmet-song-modal').on('hidden.bs.modal', () => $(document).off("keydown", handleKeyDown));

    var rerenderLyrics = function() {
        if (emmetConfig.get(CONFIG_VDISPLAYMODE) == "repeat") {
            var verses = emmetSongData.getVersesInDefinedOrder(currentlyDisplayedLang);
        } else {  // "once" OR ("repeat" AND order is not defined)
            var verses = currentlyDisplayedLang.verses;
        }
        if (verses.length == 1 && !verses[0].isChorus) {
            var verse = Object.assign({}, verses[0]);
            verse.hideDisplayName = true;
            verses = [verse];
        }
        var lyricsHtml = mustache.render(emmetUtils.getTemplate("songlyrics"), {
            'verses': verses,
            'isLiteral': currentlyDisplayedLang.isLiteral,
        });
        $("#emmet-song-lyrics").html(lyricsHtml);
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

        var newSong = emmetSongData.getCurrentBook().songsInOrder[newSongIndex];
        var newSongNumber = newSong.books.find(b => b.id == emmetSongData.getCurrentBookId()).number;
        var route = Object.assign({}, emmetRouter.getCurrentRoute(), {songNumber: newSongNumber});
        delete route.lang;
        emmetRouter.navigate(route);
    }

    var showSwitchSongDialog = function() {
        $("#emmet-song-change-modal .modal-content").html(emmetUtils.getTemplate("songchange"));

        $("#emmet-song-change-modal .emmet-songch").click(function(e) {
            switchToSongRelative(parseInt($(this).data("offset")));
        });

        new bootstrap.Modal("#emmet-song-change-modal").show();
    }

    var handleKeyDown = function(e) {
        if (e.key == "ArrowLeft") {switchToSongRelative(-1);}
        if (e.key == "ArrowRight") {switchToSongRelative(1);}
    };

    var displaySongByInternalId = function(internalSongId, options={}) {
        if (! ["lyrics", "info", "rec"].includes(options.tab)) {
            options.tab = "lyrics";
        }
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
        var songHtml = mustache.render(emmetUtils.getTemplate("song"), displaySong);
        $("#emmet-song-modal .modal-content").html(songHtml);

        // Set up bindings
        $("#emmet-song-modal .emmet-song-lang-select a.dropdown-item").click(function(e) {
            e.preventDefault();
            var lang = currentlyDisplayedSong.lyrics[$(this).data("langid")].lang;
            var route = Object.assign({}, emmetRouter.getCurrentRoute(), {lang: lang});
            emmetRouter.navigate(route);
        });
        $("#emmet-song-modal .emmet-song-toolbar li.nav-item:has(a.nav-link[data-bs-toggle='tab'])").on("shown.bs.tab", function(e) {
            bootstrap.Tooltip.getInstance(this).hide();
            var tabByTarget = {
                "#emmet-song-lyrics": "lyrics",
                "#emmet-song-details": "info",
                "#emmet-song-play": "rec",
            };
            var tab = tabByTarget[e.target.getAttribute("href")];
            if (tab !== undefined && emmetRouter.getCurrentRoute()?.tab != tab) {
                var route = Object.assign({}, emmetRouter.getCurrentRoute(), {
                    tab: tab,
                    lang: emmetRouter.getCurrentRoute()?.lang || currentlyDisplayedLang.lang,
                });
                emmetRouter.navigate(route);
            }
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
            currentSongPlayer?.destroy();
            currentSongPlayer = emmetSongPlayer.create($("#emmet-song-modal .emmet-song-player-container"));
            // Toolbar button
            $("#emmet-song-modal .emmet-song-play-btn a.nav-link").removeClass("disabled");
            // Record selector
            $("#emmet-song-modal .emmet-song-records a.emmet-song-record").click(function(e) {
                currentSongPlayer.play($(this).data("url"));
                $(this).parent().children().removeClass("active");
                $(this).addClass("active").blur();
                e.preventDefault();
            });
        } else {
            $("#emmet-song-modal .emmet-song-play-btn a.nav-link").addClass("disabled");
        }
        document.querySelectorAll("#emmet-song-modal div.emmet-song-toolbar li.nav-item")
            .forEach(it => new bootstrap.Tooltip(it, {"placement": "bottom"}));
        $(document).off("keydown", handleKeyDown).on("keydown", handleKeyDown);

        currentlyDisplayedLang = currentlyDisplayedSong.lyrics[options.langId];
        rerenderLyrics();
        $("#emmet-song-modal .emmet-song-title").text(currentlyDisplayedLang.title);
        $("#emmet-song-modal div.emmet-song-toolbar .emmet-lang-btn img.flag")
                .removeClass().addClass("flag flag-"+emmetUtils.getCountryOfLang(currentlyDisplayedLang.lang));
        $("#emmet-song-modal div.emmet-song-toolbar .emmet-lang-btn span.emmet-langname").text(currentlyDisplayedLang.lang);
        $("#emmet-song-modal div.emmet-song-toolbar a.dropdown-item").show();
        $("#emmet-song-modal div.emmet-song-toolbar a.dropdown-item.emmet-song-lang-select-"+options.langId).hide();

        var tabSelector = {
            lyrics: "#emmet-song-modal a[href='#emmet-song-lyrics']",
            info: "#emmet-song-modal a[href='#emmet-song-details']",
            rec: "#emmet-song-modal a[href='#emmet-song-play']",
        };
        if (options.tab != "lyrics") {
            bootstrap.Tab.getOrCreateInstance(document.querySelector(tabSelector[options.tab])).show();
        }
        if (!options.dontShowModal) {
            bootstrap.Modal.getOrCreateInstance("#emmet-song-modal").show();
        }
    };

    return {
        displaySong: function(songId, options={}) {
            var song = emmetSongData.getSongFromCurrentBook(songId);
            displaySongByInternalId(song.internalId, options);
        },

        displaySongByInternalId: displaySongByInternalId,
        close: function() {
            bootstrap.Modal.getInstance(document.getElementById("emmet-song-modal"))?.hide();
        },
    };
});
