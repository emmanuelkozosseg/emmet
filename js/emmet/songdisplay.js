define(['emmet/notifier', 'emmet/songdata', 'emmet/utils', 'mustache'],
function(emmetNotifier, emmetSongData, emmetUtils, mustache) {
    var langToCountry = {'hu': 'hu', 'la': 'va', 'en': 'gb', 'de': 'de'};
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
                .removeClass().addClass("flag flag-"+langToCountry[newLangOfSong.lang]);
        $("#emmet-song-modal div.emmet-song-toolbar .emmet-lang-btn span.emmet-langname").text(newLangOfSong.lang);

        // Hide currently selected from menu
        $("#emmet-song-modal div.emmet-song-toolbar a.dropdown-item").show();
        $("#emmet-song-modal div.emmet-song-toolbar a.dropdown-item.emmet-song-lang-select-"+newLangId).hide();
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

            // Update inner state
            var song = songBook.songs[songId];
            currentDisplay = {
                'song': song,
            };

            // Prepare list of available languages
            var languages = [];
            song.lyrics.forEach(function(songInLang, index) {
                languages.push({
                    'id': index,
                    'name': songInLang.lang.toUpperCase(),
                    'title': songInLang.title,
                    'country': songInLang.lang in langToCountry ? langToCountry[songInLang.lang] : '?',
                });
            });

            // Prepare list of books
            var books = [];
            song.books.forEach(function(book) {
                books.push({
                    'name': emmetSongData.getBook(book.id).name,
                    'number': book.number,
                });
            });

            // Prepare view object for Mustache and generate HTML
            var displaySong = {
                'currentNumber': song.books.find(function(b) {return b.id == songBook.id}).number,
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
            $('#emmet-song-modal div.emmet-song-toolbar a.nav-link').tooltip({"placement": "bottom"});

            changeLanguage(emmetSongData.getMainLangIdOfSong(song));
            showTab("emmet-song-lyrics");
            $("#emmet-song-modal").modal();
        },
    };
});