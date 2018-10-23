define(['emmet/notifier', 'emmet/songdata', 'emmet/songdisplay', 'emmet/utils', 'mustache'],
function(emmetNotifier, emmetSongData, emmetSongDisp, emmetUtils, mustache) {
    var tokenize = function(str) {
        str = str.toLowerCase();
        // Remove all non-word and non-space characters
        str = str.replace(/[^a-zA-Z0-9\u00C0-\u024F ]/g, "");
        // Reduce duplicate spaces
        str = str.replace(/ {2,}/g, " ");
        // Generalize accented characters
        str = str.replace(/á/g, "a");
        str = str.replace(/é/g, "e");
        str = str.replace(/í/g, "i");
        str = str.replace(/[óöő]/g, "o");
        str = str.replace(/[úüű]/g, "u");
        
        if (str == "") {return null;}
        return str;
    };
    
    var getHighlightRegexp = function(searchExpr, mode) {
        var str = searchExpr.toLowerCase();
        // Tokenize the search expression, but to make it a regexp.
        // Remove all non-word and non-space characters
        str = str.replace(/[^a-zA-Z0-9\u00C0-\u024F ]/g, "[^a-zA-Z0-9\u00C0-\u024F ]*");
        // Reduce duplicate spaces
        str = str.replace(/ {2,}/g, " +");
        // Generalize accented characters
        str = str.replace(/[aá]/g, "[aá]");
        str = str.replace(/[eé]/g, "[eé]");
        str = str.replace(/[ií]/g, "[ií]");
        str = str.replace(/[oóöő]/g, "[oóöő]");
        str = str.replace(/[uúüű]/g, "[uúüű]");
        // Space may hide non-word characters
        str = str.replace(/ /g, "(?:[^a-zA-Z0-9\u00C0-\u024F]| )+");
        // Add capture group
        str = "("+str+")";
        // Apply mode
        str = mode.addRegexpBoundaries(str);
        console.log("Highlight regexp: "+str);
        return new RegExp(str, "gi");
    };
    
    var findInTokenized = function(str, verse, mode) {
        var searchRegexp = mode.addRegexpBoundaries(str);
        return new RegExp(searchRegexp, "gi").test(verse);
    };
    
    return {
        // Search modes
        modes: {
            wholeWord: {
                name: "teljes szavas",
                addRegexpBoundaries: function(str) {
                    // It should begin and end on word boundaries
                    return "(?:^| )"+str+"(?:$| )";
                },
            },
            partialWord: {
                name: "törtszavas",
                addRegexpBoundaries: function(str) {
                    // It can match anywhere -- no modification needed
                    return str;
                }
            }
        },
        
        tokenizeVerseLines: function(lines) {
            var tokenized = [];
            for (var i = 0; i < lines.length; i++) {
                var tokenizedLine = tokenize(lines[i]);
                if (tokenizedLine == null) {
                    continue;
                }
                tokenized.push(tokenizedLine);
            }
            return tokenized.join(" ");
        },
        
        search: function(searchExpr, searchMode) {
            var songBook = emmetSongData.getCurrentBook();
            
            // Tokenize the search string
            var tokenizedExpr = tokenize(searchExpr);
            if (tokenizedExpr == null) {
                emmetNotifier.showError(
                        "Érvénytelen keresés",
                        "Kérünk, olyan keresőkifejezést adj meg, amiben szerepelnek betűk vagy számok."
                );
                return;
            }
            
            // Convert search string to highlighter regexp -- this will be used to highlight matches in the results
            var highlightRegexp = getHighlightRegexp(searchExpr, searchMode);
            
            // Search
            var titleResults = [];
            var textResults = {};
            for (songNo in songBook.songs) {
                var song = songBook.songs[songNo];
                var lyrics = song.lyrics[0];  // TODO: handle languages correctly
                
                // Look for results in the song title
                if (findInTokenized(tokenizedExpr, tokenize(lyrics.title), searchMode)) {
                    titleResults.push({
                        number: songNo,
                        title: lyrics.title.replace(highlightRegexp, "<mark>$1</mark>"),
                    });
                }
                
                // Look for results in the lyrics
                for (var i = 0; i < lyrics.verses.length; i++) {
                    var verse = lyrics.verses[i];
                    
                    // If there's no match, continue
                    if (! findInTokenized(tokenizedExpr, verse.tokenizedLines, searchMode)) {
                        continue;
                    }
                    
                    // If we don't have this song in the results yet, create it
                    if (! textResults.hasOwnProperty(songNo)) {
                        textResults[songNo] = {
                                number: songNo,
                                title: lyrics.title,
                                matchedVerses: [],
                        };
                    }
                    
                    // Generate highlight markup
                    var highlightedVerses = [];
                    for (var j = 0; j < verse.lines.length; j++) {
                        var highlightedMatch = verse.lines[j].replace(highlightRegexp, "<mark>$1</mark>")
                        highlightedVerses.push(highlightedMatch);
                    }
                    
                    // Add it all to the matched verses
                    textResults[songNo].matchedVerses.push({
                            displayName: verse.displayName,
                            lines: highlightedVerses,
                            isChorus: emmetUtils.isChorus(verse.name),
                            isBridge: emmetUtils.isBridge(verse.name),
                    });
                }
            }
            
            // Convert map to array for Mustache
            var textResultsArr = [];
            for (songNo in textResults) {
                textResultsArr.push(textResults[songNo]);
            }
            
            // Compile result HTML
            var resultsHtml = mustache.to_html(emmetUtils.getTemplate("search"), {
                searchExpr: searchExpr,
                numOfResults: titleResults.length + textResultsArr.length,
                searchMode: searchMode.name,
                hasTitleResults: (titleResults.length > 0), 
                titleResults: titleResults,
                numOfTitleResults: titleResults.length,
                hasTextResults: (textResultsArr.length > 0), 
                textResults: textResultsArr,
                numOfTextResults: textResultsArr.length,
            });
            $("#emmet-p-search").html(resultsHtml);
            $("#emmet-p-search a.emmet-search-item").click(function() {
                emmetSongDisp.displaySong(String($(this).data("songnumber")));
                return false;
            });
            emmetUtils.showPage("search");
        },
    };
});