emmet.search = (function() {
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
        return str.split(" ");
    };
    
    var getHighlightRegexp = function(searchExpr) {
        var str = searchExpr.toLowerCase();
        // Tokenize the search expression, but to make it a regexp.
        // Remove all non-word and non-space characters
        str = str.replace(/[^a-zA-Z0-9\u00C0-\u024F ]/g, "[^a-zA-Z0-9\u00C0-\u024F ]*");
        // Reduce duplicate spaces
        str = str.replace(/ {2,}/g, " +");
        // Generalize accented characters
        str = str.replace(/[aá]/g, "[aáÁ]");
        str = str.replace(/[eé]/g, "[eéÉ]");
        str = str.replace(/[ií]/g, "[iíÍ]");
        str = str.replace(/[oóöő]/g, "[oóÓöÖőŐ]");
        str = str.replace(/[uúüű]/g, "[uúÚüÜűŰ]");
        return new RegExp("("+str+")", "gi");
    };
    
    var findInTokenized = function(str, verse) {
        if (str.length == verse.length) {
            // The method below won't work, check for exact match
            for (var i = 0; i < str.length; i++) {
                if (str[i] != verse[i]) {
                    return false;
                }
            }
            return true;
        }
        
        verseLoop:
        for (var i = 0; i < verse.length - str.length; i++) {
            strLoop:
            for (var j = 0; j < str.length; j++) {
                if (str[j] != verse[i+j]) {
                    continue verseLoop;
                }
            }
            return true;
        }
        return false;
    };
    
    return {
        tokenizeVerseLines: function(lines) {
            var tokenized = [];
            for (var i = 0; i < lines.length; i++) {
                var tokenizedLine = tokenize(lines[i]);
                if (tokenizedLine == null) {
                    continue;
                }
                tokenized = tokenized.concat(tokenizedLine);
            }
            return tokenized;
        },
        
        search: function(searchExpr) {
            var songBook = emmet.main.getCurrentBook();
            
            var highlightRegexp = getHighlightRegexp(searchExpr);
            
            var tokenizedExpr = tokenize(searchExpr);
            if (tokenizedExpr == null) {
                emmet.notifier.showError(
                        "Érvénytelen keresés",
                        "Kérünk, olyan keresőkifejezést adj meg, amiben szerepelnek betűk vagy számok."
                );
                return;
            }
            
            var titleResults = [];
            var textResults = {};
            for (songNo in songBook.songs) {
                var song = songBook.songs[songNo];
                
                // Look for results in the song title
                if (findInTokenized(tokenizedExpr, tokenize(song.title))) {
                    titleResults.push({
                        number: song.number,
                        displayNumber: song.displayNumber,
                        title: song.title.replace(highlightRegexp, "<mark>$1</mark>"),
                    });
                }
                
                // Look for results in the lyrics
                for (var i = 0; i < song.verses.length; i++) {
                    var verse = song.verses[i];
                    
                    if (! findInTokenized(tokenizedExpr, verse.tokenizedLines)) {
                        continue;
                    }
                    if (! textResults.hasOwnProperty(songNo)) {
                        textResults[songNo] = {
                                number: song.number,
                                displayNumber: song.displayNumber,
                                title: song.title,
                                matchedVerses: [],
                        };
                    }
                    
                    var highlightedVerses = [];
                    for (var j = 0; j < verse.lines.length; j++) {
                        var highlightedMatch = verse.lines[j].replace(highlightRegexp, "<mark>$1</mark>")
                        highlightedVerses.push(highlightedMatch);
                    }
                    textResults[songNo].matchedVerses.push({
                            displayCode: verse.displayCode,
                            lines: highlightedVerses,
                    });
                }
            }
            
            var textResultsArr = [];
            for (songNo in textResults) {
                textResultsArr.push(textResults[songNo]);
            }
            
            var resultsHtml = Mustache.to_html(emmet.main.getTemplate("search"), {
                searchExpr: searchExpr,
                numOfResults: titleResults.length + textResultsArr.length,
                hasTitleResults: (titleResults.length > 0), 
                titleResults: titleResults,
                numOfTitleResults: titleResults.length,
                hasTextResults: (textResultsArr.length > 0), 
                textResults: textResultsArr,
                numOfTextResults: textResultsArr.length,
            });
            $("#emmet-p-search").html(resultsHtml);
            $("#emmet-p-search a.emmet-search-item").click(function() {
                emmet.songDisplay.displaySong(String($(this).data("songnumber")));
                return false;
            });
            emmet.main.showPage("search");
        },
    };
})();