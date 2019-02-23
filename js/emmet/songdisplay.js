define(['emmet/notifier', 'emmet/songdata', 'emmet/utils', 'mustache', 'audioplayer'],
function(emmetNotifier, emmetSongData, emmetUtils, mustache, audioplayer) {
    var currentDisplay = null;

    var showTab = function(tabIdClass) {
        var selectedTab = $("#emmet-song-modal div.emmet-song-tab."+tabIdClass);
        $("#emmet-song-modal div.emmet-song-tab").hide();
        selectedTab.show();

        $("#emmet-song-modal div.emmet-song-toolbar a.nav-link").removeClass("active");
        $("#emmet-song-modal div.emmet-song-toolbar ."+selectedTab.data("trigger")+" a.nav-link").addClass("active");
    };

    var changeLanguage = function(newLangId) {
        var newLangOfSong = currentDisplay['song'].lyrics[newLangId];

        // Display language's div
        $("#emmet-song-modal .emmet-song-lang").hide();
        $("#emmet-song-modal .emmet-song-lang-"+newLangId).show();

        // Set modal title
        $("#emmet-song-modal .emmet-song-title").text(newLangOfSong.title);

        // Update language menu
        $("#emmet-song-modal div.emmet-song-toolbar .emmet-lang-btn img.flag")
                .removeClass().addClass("flag flag-"+emmetUtils.getCountryOfLang(newLangOfSong.lang));
        $("#emmet-song-modal div.emmet-song-toolbar .emmet-lang-btn span.emmet-langname").text(newLangOfSong.lang);

        // Hide currently selected from menu
        $("#emmet-song-modal div.emmet-song-toolbar a.dropdown-item").show();
        $("#emmet-song-modal div.emmet-song-toolbar a.dropdown-item.emmet-song-lang-select-"+newLangId).hide();
    };

    var displaySongByInternalId = function(internalSongId, langId) {
        var song = emmetSongData.getAllSongs()[internalSongId];

        // If no language is requested, fall back to the main language
        if (langId === undefined) {
            langId = emmetSongData.getMainLangIdOfSong(song);
        }

        // Update inner state
        currentDisplay = {
            'song': song,
        };

        // Prepare list of available languages
        var languages = song.lyrics.map((songInLang, index) => {
            var country = emmetUtils.getCountryOfLang(songInLang.lang);
            return {
                'id': index,
                'name': songInLang.lang.toUpperCase(),
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

        var songInBook = song.books.find(function(b) {return b.id == emmetSongData.getCurrentBook().id});
        var currentNumber = songInBook===undefined ? undefined : songInBook.number;

        // Prepare view object for Mustache and generate HTML
        var displaySong = {
            'currentNumber': currentNumber,
            'languages': languages,
            'isSingleLanguage': languages.length == 1,
            'books': books,
            'song': song,
        };
        var songHtml = mustache.to_html(emmetUtils.getTemplate("song"), displaySong);
        $("#emmet-song-modal .modal-content").html(songHtml);

        // Set up bindings
        $("#emmet-song-modal .emmet-song-lang-select a.dropdown-item").click(function(e) {
            changeLanguage($(this).data("langid"));
            e.preventDefault();
        });
        $("#emmet-song-modal .emmet-song-lyrics-btn a.nav-link").click(function(e) {
            showTab("emmet-song-lyrics");
            $(this).tooltip('hide');
            e.preventDefault();
        });
        $("#emmet-song-modal .emmet-song-details-btn a.nav-link").click(function(e) {
            showTab("emmet-song-details");
            $(this).tooltip('hide');
            e.preventDefault();
        });
        if (song.records) {
            $("#emmet-song-modal .emmet-song-play-btn a.nav-link").click(function(e) {
                showTab("emmet-song-play");
                $(this).tooltip('hide');
                e.preventDefault();
            });
        } else {
            $("#emmet-song-modal .emmet-song-play-btn a.nav-link").addClass("disabled");
        }
        $('#emmet-song-modal div.emmet-song-toolbar a.nav-link').tooltip({"placement": "bottom"});

        changeLanguage(langId);
        showTab("emmet-song-lyrics");
        $("#emmet-song-modal").modal();

        // Set up audio
        if (song.records) {
            $.AudioPlayer.init({
                container: "#emmet-song-modal .emmet-song-player",
                source: song.records[0].url,
                imagePath: "css/jquery.audioplayer/image",
            });
            $('#emmet-song-modal').on('hidden.bs.modal', function() {
                $.AudioPlayer.pause();
            });
        }
    };

    return {
        displaySong: function(songId) {
            var songBook = emmetSongData.getCurrentBook();
            if (! songBook.songs.hasOwnProperty(songId)) {
                emmetNotifier.showError(
                        "Hiányzó ének",
                        "Nincs <strong>"+songId+"</strong>. számú ének a kiválasztott énekeskönyvben ("+songBook.name+").");
                return;
            }
            displaySongByInternalId(songBook.songs[songId].internalId);
        },

        displaySongByInternalId: displaySongByInternalId,
    };
});