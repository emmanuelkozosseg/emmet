define(['emmet/songdata', 'emmet/songdisplay', 'emmet/utils', 'mustache'],
function(emmetSongData, emmetSongDisp, emmetUtils, mustache) {
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
    
    var sortByNumber = function(songs) {
        var songList = [];
        
        // Sort by natural ordering
        var songNumbers = [];
        for (songNo in songs) {
            songNumbers.push(songNo);
        }
        songNumbers = songNumbers.sort(emmetUtils.getCollator().compare);
        songNumbers.forEach(songNo => {
            songList.push(songs[songNo]);
        });
        
        return songList;
    };
    
    var sortByTitle = function(songs) {
        var songList = [];
        for (songNo in songs) {
            songList.push(songs[songNo]);
        }
        return songList.sort(function(a, b) {
            return emmetUtils.getCollator().compare(emmetSongData.getMainLangOfSong(a).title, emmetSongData.getMainLangOfSong(b).title);
        });
    };
    
    var refreshSongList = function() {
        var songBook = emmetSongData.getCurrentBook();
        
        var songList;
        if (sortBy == "title") {
            songList = sortByTitle(songBook.songs);
        } else {
            songList = sortByNumber(songBook.songs);
        }

        for (var i = 0; i < songList.length; i++) {
            var currentSong = songList[i];
            songList[i] = {
                'number': currentSong.books.find(b => {return b.id == songBook.id}).number,
                'title': emmetSongData.getMainLangOfSong(currentSong).title,
            };
        }
        
        var listHtml = mustache.to_html(emmetUtils.getTemplate("toc-list"), songList);
        $("main .emmet-toc-list").html(listHtml);
        $("main .emmet-toc-list a").click(function() {
            emmetSongDisp.displaySong(String($(this).data("songnumber")));
            return false;
        });
    };
    
    var show = function() {
        if (! loadedBook) {
            $("main #emmet-p-toc input[type=radio][name=emmet-toc-sortby]").change(toggleSortBy);
        }
        if (loadedBook != emmetSongData.getCurrentBook().id) {
            refreshSongList();
            loadedBook = emmetSongData.getCurrentBook().id;
        }
        emmetUtils.showPage("toc");
    };
    
    return {
        show: show,
    };
});
