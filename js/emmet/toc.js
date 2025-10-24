define(['bootstrap', 'emmet/config', 'emmet/songdata', 'emmet/songdisplay', 'emmet/utils', 'jquery', 'mustache'],
function(bootstrap, emmetConfig, emmetSongData, emmetSongDisp, emmetUtils, _j, mustache) {
    const CONFIG_SORTBY = "toc-sortby";
    const CONFIG_SHOWCHAPTERS = "toc-showchapters";
    var loadedBook = null;

    emmetConfig.configureSettings({
        [CONFIG_SORTBY]: "num",
        [CONFIG_SHOWCHAPTERS]: true,
    });

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
        if (emmetConfig.get(CONFIG_SORTBY) == "title") {
            songList = sortByTitle(songBook.songs);
        } else {
            songList = sortByNumber(songBook.songs);
        }

        var mustacheOptions = {
            options: {
                sortByNum: emmetConfig.get(CONFIG_SORTBY) != "title",
                sortByTitle: emmetConfig.get(CONFIG_SORTBY) == "title",
                showChapters: emmetConfig.get(CONFIG_SHOWCHAPTERS),
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

        if (emmetConfig.get(CONFIG_SHOWCHAPTERS)) {
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
        
        var listHtml = mustache.render(emmetUtils.getTemplate("toc"), mustacheOptions);
        $("#emmet-p-toc").html(listHtml);
        $("#emmet-p-toc .emmet-toc-sortby").click(function() {
            var newSortBy = $(this).data("sortby");
            if (emmetConfig.get(CONFIG_SORTBY) == newSortBy) {return;}
            emmetConfig.set(CONFIG_SORTBY, newSortBy);
            refreshSongList();
            return false;
        });
        $("#emmet-p-toc .emmet-toc-show-chapters").click(function() {
            emmetConfig.set(CONFIG_SHOWCHAPTERS, ! emmetConfig.get(CONFIG_SHOWCHAPTERS));
            refreshSongList();
            return false;
        });
        $("#emmet-p-toc .emmet-toc-chapter-control").click(function() {
            var action = $(this).data("action");
            var allChapters = document.querySelectorAll("#emmet-p-toc .emmet-toc-list.collapse");
            if (action == "expand") {allChapters.forEach(it => bootstrap.Collapse.getOrCreateInstance(it).show());}
            if (action == "collapse") {allChapters.forEach(it => bootstrap.Collapse.getOrCreateInstance(it).hide());}
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
