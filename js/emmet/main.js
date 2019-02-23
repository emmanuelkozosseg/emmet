define(['emmet/search', 'emmet/searchdialog', 'emmet/loader', 'emmet/toc', 'emmet/songdisplay', 'emmet/songdata', 'emmet/utils', 'mustache'],
        function(emmetSearch, emmetSearchDialog, emmetLoader, emmetToc, emmetSongDisp, emmetSongData, emmetUtils, mustache) {
    var collapseNavBar = function() {
        $('.navbar-collapse').collapse('hide');
    };

    var hideMainDropdown = function() {
        $("#emmetNavMainDropdown").dropdown('toggle');
    };
    var hideBookDropdown = function() {
        $("#emmetNavBookDropdown").dropdown('toggle');
    };
    
    var search = function(searchElem) {
        emmetSearch.search(searchElem.val(), "simple", "wholeWord");
        $(searchElem).val("");
        collapseNavBar();
    };

    var searchAdvanced = function(searchElem) {
        emmetSearchDialog.displayAdvancedSearch(searchElem.val());
        $(searchElem).val("");
        collapseNavBar();
    };
    
    var init = function() {
        // Load songs
        emmetLoader.loadSongs(onSongsLoaded);
        
        // Set up navbar
        $("#emmet-nav-mainlink").click(function(e) {
            e.preventDefault();
            emmetUtils.showPage("main");
            collapseNavBar();
        });
        $("#emmet-navdd-mainlink").click(function(e) {
            e.preventDefault();
            emmetUtils.showPage("main");
            hideMainDropdown();
        });
        $("#emmet-navdd-helplink").click(function(e) {
            e.preventDefault();
            emmetUtils.showPage("help");
            hideMainDropdown();
        });
        $("#emmet-toc-link").click(function(e) {
            e.preventDefault();
            emmetToc.show();
            hideBookDropdown();
            collapseNavBar();
        });
        $(".emmet-form-jumpto").submit(function(e) {
            e.preventDefault();
            var songNoField = $(this).find(".emmet-jumpto-songno");
            emmetSongDisp.displaySong(songNoField.val());
            songNoField.val("");
            collapseNavBar();
        })
        $(".emmet-form-search").submit(function(e) {
            e.preventDefault();
            search($(this).find(".emmet-search-expr"));
        });
        $(".emmet-search-simple").click(function() {
            search($(this).parents(".input-group").children(".emmet-search-expr"));
        });
        $(".emmet-search-advanced").click(function() {
            searchAdvanced($(this).parents(".input-group").children(".emmet-search-expr"));
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
            hideBookDropdown();
            return false;
        });
        
        // Change label of button
        $("#emmetNavBookDropdown > span.emmet-book-name").text(emmetSongData.getCurrentBook().name);
    };
    
    return {
        init: init,
    };
});
