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
        for (var songNo of Object.keys(songs)) {
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
        for (var songNo of Object.keys(songs)) {
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

        var songsByChapters = new Map();
        for (var currentSong of songList) {
            var bookEntryOfSong = currentSong.books.find(b => {return b.id == songBook.id});
            if (! songsByChapters.has(bookEntryOfSong.chapter)) {
                songsByChapters.set(bookEntryOfSong.chapter, []);
            }
            songsByChapters.get(bookEntryOfSong.chapter).push({
                'number': bookEntryOfSong.number,
                'title': emmetSongData.getMainLangOfSong(currentSong).title,
            });
        }

        var songsByChaptersList = [];
        if (songBook.chapters) {
            for (var chapter of songBook.chapters) {
                songsByChaptersList.push({
                    'id': chapter.id,
                    'badge': chapter.badge,
                    'name': chapter.name,
                    'songs': songsByChapters.get(chapter.id),
                });
            }
        }
        
        var listHtml = mustache.to_html(emmetUtils.getTemplate("toc"), {
            hasChapters: songBook.chapters !== undefined,
            chapters: songsByChaptersList,
            otherSongs: songsByChapters.get(undefined),
        });
        $("#emmet-p-toc").html(listHtml);
        $("#emmet-p-toc .emmet-toc-sortby input[name=emmet-toc-sortby]").parent().removeClass("active");
        $("#emmet-toc-sortby-"+sortBy).parent().addClass("active");
        $("#emmet-p-toc .emmet-toc-sortby input[name=emmet-toc-sortby]").change(toggleSortBy);
        $("#emmet-p-toc .emmet-toc-list a").click(function() {
            emmetSongDisp.displaySong(String($(this).data("songnumber")));
            return false;
        });
    };
    
    var show = function() {
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
