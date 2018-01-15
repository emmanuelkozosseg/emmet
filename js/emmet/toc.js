emmet.toc = (function() {
    var sortBy = "num";
    var loadedBook = null;
    
    var toggleSortBy = function() {
        var newSortBy = this.value;
        if (newSortBy == sortBy) {
            return;
        }
        sortBy = newSortBy;
        refreshSongList();
    };
    
    var sortByNumber = function(songBook) {
        var songList = [];
        
        // Sort by natural ordering
        var songNumbers = [];
        for (songNo in songBook.songs) {
            songNumbers.push(songNo);
        }
        songNumbers = songNumbers.sort(naturalSort);
        for (var i = 0; i < songNumbers.length; i++) {
            songList.push(songBook.songs[songNumbers[i]]);
        }
        
        return songList;
    };
    
    var sortByTitle = function(songBook) {
        var songList = [];
        for (songNo in songBook.songs) {
            songList.push(songBook.songs[songNo]);
        }
        return songList.sort(function(a,b) {
            return naturalSort(a.title, b.title);
        });
    }
    
    var refreshSongList = function() {
        var songBook = emmet.main.getCurrentBook();
        
        var songList;
        if (sortBy == "title") {
            songList = sortByTitle(songBook);
        } else {
            songList = sortByNumber(songBook);
        }
        
        var listHtml = Mustache.to_html(emmet.main.getTemplate("toc-list"), songList);
        $("main .emmet-toc-list").html(listHtml);
        $("main .emmet-toc-list a").click(function() {
            emmet.songDisplay.displaySong(String($(this).data("songnumber")));
            return false;
        });
    };
    
    var show = function() {
        if (! loadedBook) {
            $("main #emmet-p-toc input[type=radio][name=emmet-toc-sortby]").change(toggleSortBy);
        }
        if (loadedBook != emmet.main.getCurrentBook().id) {
            refreshSongList();
            loadedBook = emmet.main.getCurrentBook().id;
        }
        emmet.main.showPage("toc");
    };
    
    return {
        show: show,
    };
})();
