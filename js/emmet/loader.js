define(['emmet/notifier', 'emmet/tokenizer', 'emmet/utils'], function(emmetNotifier, emmetTokenizer, emmetUtils) {
    var startLoad = function(finalCallback) {
        $.ajax({
            url: "songs.json",
            dataType: "json",
            success: function(data, textStatus, jqXHR) {
                try {
                    processSongData(data, finalCallback);
                } catch (e) {
                    console.error(e);
                    emmetNotifier.showSongLoadingError(e.hasOwnProperty("stack") ? e.stack : "(error not available)");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                var errorMsg = "Error when loading songs.\nHTTP status: '"+jqXHR.status+"'\nStatus text: '"+jqXHR.statusText+"'\n"+
                        "Text status: '"+textStatus+"'";
                console.error(errorMsg);
                console.error("Response text:'"+jqXHR.responseText+"'");
                emmetNotifier.showSongLoadingError(errorMsg);
            },
        });
    };
    
    var processSongData = function(origSongData, finalCallback) {
        var songData = {
            'bookList': origSongData.books,
            'books': {},
            'songs': origSongData.songs,
        };
        
        origSongData.books.forEach(book => {
            songData.books[book.id] = book;
            songData.books[book.id].songs = {};
        });

        origSongData.songs.forEach((song, index) => {
            song.internalId = index;
            song.books.forEach(bookOfSong => {
                songData.books[bookOfSong.id].songs[bookOfSong.number.toLowerCase()] = song;
            });
            song.lyrics.forEach((songInLang, index) => {
                songInLang.langId = index;
                songInLang.isLiteral = 'type' in songInLang && songInLang.type == "literal";
                songInLang.tokenizedTitle = emmetTokenizer.tokenize(songInLang.title);
                songInLang.verses.forEach((verse, index) => {
                    verse.verseId = index;
                    verse.displayName = getDisplayedVerseCode(verse.name);
                    verse.isChorus = emmetUtils.isChorus(verse.name);
                    verse.isBridge = emmetUtils.isBridge(verse.name);

                    // Convert slide breaks to line breaks -- we handle them in the same way
                    for (var i = 0; i < verse.lines.length; i++) {
                        if (verse.lines[i] == null) {
                            verse.lines[i] = "";
                        }
                    }

                    verse.tokenizedLines = emmetTokenizer.tokenizeVerseLines(verse.lines);
                });
            });
        });
        
        finalCallback(songData);
    };
    
    var getDisplayedVerseCode = function(verseCode) {
        var type = verseCode.substring(0, 1);
        var number = verseCode.substring(1);

        var dispCode;
        if (type == "c") {dispCode = "R";}
        else if (type == "b") {dispCode = "Á";}
        else if (type == "p") {dispCode = "E";}
        else {dispCode = "";}
        
        dispCode += number;
        return dispCode;
    };
    
    return {
        loadSongs: function(callback) {
            startLoad(callback);
        },
    };
});