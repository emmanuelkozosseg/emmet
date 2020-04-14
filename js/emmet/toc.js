define(['emmet/songdata', 'emmet/songdisplay', 'emmet/utils', 'mustache'],
function(emmetSongData, emmetSongDisp, emmetUtils, mustache) {
    var sortBy = "num";
    var showChapters = true;
    var loadedBook = null;

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

        var mustacheOptions = {
            options: {
                sortByNum: sortBy == "num",
                sortByTitle: sortBy == "title",
                showChapters: showChapters,
            },
        };

        var songToDisplayableSong = function(song) {
            var bookEntryOfSong = song.books.find(b => {return b.id == songBook.id});
            return {
                'bookEntry': bookEntryOfSong,
                'number': bookEntryOfSong.number,
                'title': emmetSongData.getMainLangOfSong(song).title,
                'hasRecords': song.records !== undefined,
            };
        }

        if (showChapters) {
            var songsByChapters = new Map();
            for (var currentSong of songList) {
                var displayableSong = songToDisplayableSong(currentSong);
                if (! songsByChapters.has(displayableSong.bookEntry.chapter)) {
                    songsByChapters.set(displayableSong.bookEntry.chapter, []);
                }
                songsByChapters.get(displayableSong.bookEntry.chapter).push(displayableSong);
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

            mustacheOptions["hasChapters"] = songBook.chapters !== undefined;
            mustacheOptions["chapters"] = songsByChaptersList;
            mustacheOptions["otherSongs"] = songsByChapters.get(undefined);
        } else {
            mustacheOptions["hasChapters"] = false;
            mustacheOptions["otherSongs"] = songList.map(s => songToDisplayableSong(s));
        }
        
        var listHtml = mustache.to_html(emmetUtils.getTemplate("toc"), mustacheOptions);
        $("#emmet-p-toc").html(listHtml);
        $("#emmet-p-toc .emmet-toc-sortby").click(function() {
            var newSortBy = $(this).data("sortby");
            if (sortBy == newSortBy) {return;}
            sortBy = newSortBy;
            refreshSongList();
            return false;
        });
        $("#emmet-p-toc .emmet-toc-show-chapters").click(function() {
            showChapters = ! showChapters;
            refreshSongList();
            return false;
        });
        $("#emmet-p-toc .emmet-toc-chapter-control").click(function() {
            var action = $(this).data("action");
            var allChapters = $("#emmet-p-toc .emmet-toc-list.collapse");
            if (action == "expand") {allChapters.collapse("show");}
            if (action == "collapse") {allChapters.collapse("hide");}
            $(this).parents(".dropdown").dropdown("hide");
            return false;
        });
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
