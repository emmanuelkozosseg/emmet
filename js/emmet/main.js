emmet.main = (function() {
    var songData = null;
    var currentBook = "emm_hun";
    
    var collapseNavBar = function() {
        $('.navbar-collapse').collapse('hide');
    };
    
    var init = function() {
        // Load songs
        emmet.songLoader.loadSongs(onSongsLoaded);
        
        // Set up navbar
        $("#emmet-nav-mainlink").click(function() {
            emmet.main.showPage("main");
            collapseNavBar();
            return false;
        });
        $("#emmet-toc-link").click(function() {
            emmet.toc.show();
            collapseNavBar();
            return false;
        });
        $("#emmet-form-jumpto").submit(function(e) {
            e.preventDefault();
            emmet.songDisplay.displaySong($("#emmet-jumpto-songno").val());
            $("#emmet-jumpto-songno").val("");
            collapseNavBar();
        })
        $("#emmet-form-search").submit(function(e) {
            e.preventDefault();
            emmet.search.search($("#emmet-search-expr").val());
            $("#emmet-search-expr").val("");
            collapseNavBar();
        });
        
        // Show main page by default
        emmet.main.showPage("main");
    };
    
    var onSongsLoaded = function(data) {
        songData = data;
        updateBookList();
    };
    
    var updateBookList = function() {
        var otherBooks = [];
        for (bookId in songData) {
            if (bookId == currentBook) {continue;}
            otherBooks.push(songData[bookId]);
        }
        otherBooks.sort(function(a,b) {
            if (a.name < b.name) {return -1};
            if (a.name > b.name) {return 1};
            return 0;
        });
        var bookListHtml = Mustache.to_html(emmet.main.getTemplate("booklist"), {
            selectedBookName: emmet.main.getCurrentBook().name,
            otherBooks: otherBooks,
        });
        $("#emmet-nav-bookselector").html(bookListHtml);
        $("#emmet-nav-bookselector .dropdown-item:not(.disabled)").click(function() {
            setBook($(this).data("bookid"));
            $("#emmetNavbarDropdown").parent("li.nav-item.dropdown").dropdown('toggle');
            return false;
        });
    };
    
    var setBook = function(newBookId) {
        currentBook = newBookId;
        updateBookList();
        emmet.main.showPage("main");
    };
    
    return {
        getCurrentBook: function() {return songData[currentBook];},
        init: init,
        
        showPage: function(pageId) {
            $("main").children().hide();
            $("#emmet-p-"+pageId).show();
        },
        
        getTemplate: function(templateId) {
            return $("#emmet-tmpl-"+templateId).html();
        },
        
    };
})();
