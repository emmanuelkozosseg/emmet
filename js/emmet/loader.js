define(['emmet/notifier', 'emmet/search', 'emmet/utils'], function(emmetNotifier, emmetSearch, emmetUtils) {
    var startLoad = function(finalCallback) {
        $.ajax({
            url: "getsongs.php",
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
            'books': {},
            'songs': origSongData['songs'],
        };
        
        origSongData['books'].forEach(function(book) {
            songData['books'][book['id']] = book;
            songData['books'][book['id']]['songs'] = {};
        });

        origSongData['songs'].forEach(function(song) {
            song['books'].forEach(function(bookOfSong) {
                songData['books'][bookOfSong['id']]['songs'][bookOfSong['number']] = song;
            });
            song['lyrics'].forEach(function(songInLang, index) {
                songInLang['langId'] = index;
                songInLang['verses'].forEach(function(verse) {
                    verse.displayName = getDisplayedVerseCode(verse.name);
                    verse.isChorus = emmetUtils.isChorus(verse.name);
                    verse.isBridge = emmetUtils.isBridge(verse.name);

                    // Convert slide breaks to line breaks -- we handle them in the same way
                    for (var i = 0; i < verse.lines.length; i++) {
                        if (verse.lines[i] == null) {
                            verse.lines[i] = "";
                        }
                    }

                    verse.tokenizedLines = emmetSearch.tokenizeVerseLines(verse.lines);
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