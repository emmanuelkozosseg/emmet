define(['emmet/search', 'emmet/loader', 'emmet/toc', 'emmet/songdisplay', 'emmet/songdata', 'emmet/utils', 'mustache'],
        function(emmetSearch, emmetLoader, emmetToc, emmetSongDisp, emmetSongData, emmetUtils, mustache) {
    var collapseNavBar = function() {
        $('.navbar-collapse').collapse('hide');
    };
    
    var search = function(mode) {
        emmetSearch.search($("#emmet-search-expr").val(), mode);
        $("#emmet-search-expr").val("");
        collapseNavBar();
    };
    
    var init = function() {
        // Load songs
        emmetLoader.loadSongs(onSongsLoaded);
        
        // Set up navbar
        $("#emmet-nav-mainlink").click(function() {
            emmetUtils.showPage("main");
            collapseNavBar();
            return false;
        });
        $("#emmet-toc-link").click(function() {
            emmetToc.show();
            collapseNavBar();
            return false;
        });
        $("#emmet-form-jumpto").submit(function(e) {
            e.preventDefault();
            emmetSongDisp.displaySong($("#emmet-jumpto-songno").val());
            $("#emmet-jumpto-songno").val("");
            collapseNavBar();
        })
        $("#emmet-form-search").submit(function(e) {
            e.preventDefault();
            search(emmetSearch.modes.wholeWord);
        });
        $("#emmet-search-wholeword").click(function() {
            search(emmetSearch.modes.wholeWord);
        });
        $("#emmet-search-partword").click(function() {
            search(emmetSearch.modes.partialWord);
            $("#emmet-search-partword").parent(".dropdown-menu.show").dropdown('toggle');
            return false;
        });
        
        // Show main page by default
        emmetUtils.showPage("main");
    };
    
    var onSongsLoaded = function(data) {
        emmetSongData.setData(data);
        updateBookList();
        $("#emmet-loading").fadeOut();
    };

    var setBook = function(newBookId) {
        emmetSongData.setBook(newBookId);
        updateBookList();
        emmetUtils.showPage("main");
    };
    
    var updateBookList = function() {
        // Select non-opened books
        var otherBooks = [];
        emmetSongData.getBookIds().forEach(function(bookId) {
            if (bookId == emmetSongData.getCurrentBookId()) {return;}
            otherBooks.push(emmetSongData.getBook(bookId));
        });
        otherBooks.sort(function(a,b) {
            if (a.name < b.name) {return -1};
            if (a.name > b.name) {return 1};
            return 0;
        });
        
        // Populate dropdown
        var bookListHtml = mustache.to_html(emmetUtils.getTemplate("booklist"), otherBooks);
        $("#emmet-nav-bookselector").html(bookListHtml);
        $("#emmet-nav-bookselector .dropdown-item:not(.disabled)").click(function() {
            setBook($(this).data("bookid"));
            $("#emmetNavbarDropdown").parent("li.nav-item.dropdown").dropdown('toggle');
            return false;
        });
        
        // Change label of button
        $("#emmetNavbarDropdown").text(emmetSongData.getCurrentBook().name);
    };
    
    return {
        init: init,
    };
});
