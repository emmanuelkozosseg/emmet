define(['emmet/notifier', 'emmet/songdata', 'emmet/songdisplay', 'emmet/tokenizer', 'emmet/utils', 'mustache'],
function(emmetNotifier, emmetSongData, emmetSongDisp, emmetTokenizer, emmetUtils, mustache) {
    /*
    Results for template: {
        // Calculated during search (one item per matched *lang*)
        titleResults[]: {
            internalSongId, langId
            songNumber (only simple)
            lang, country (only full)
            title, highlightedTitle
        }
        textResults[]: {
            internalSongId, langId
            songNumber (only simple)
            lang, country (only full)
            title, highlightedTitle
            highlightedVerses[]: {
                displayName, isChorus, isBridge
                lines[]
            }
        }
        // Added after search:
        searchExpr: search expression
        hasTitleMatches
        numOfTitleMatches
        hasTextMatches
        numOfTextMatches
        numOfResults: sum of the two numbers above
    }
    */

    var searchModes = {
        /*
        getLyricsToSearchIn(allSongs[], languages[]): filters which lyrics to search in
            Returns array of: {
                song: ref to song obj
                lyrics[]: refs to lyrics objs
            }
        addSongMetadataToResult(songObj, lyricsObj, searchResultObj)
        */
        simple: {
            name: "egyszerű keresés",
            getLyricsToSearchIn: function(allSongs, languages) {
                var filteredSongs = [];
                for (let song of allSongs) {
                    var currentBook = song.books.find(b => b.id == emmetSongData.getCurrentBookId());
                    if (currentBook === undefined) {
                        continue;  // This song isn't in the current book
                    }
                    filteredSongs.push({
                        song: song,
                        lyrics: [song.lyrics.find(l => l.lang == currentBook.lang)],
                    });
                }
                return filteredSongs;
            },
            addSongMetadataToResult: function(song, langObj, searchResultObj) {
                searchResultObj["songNumber"] = song.books.find(b => b.id == emmetSongData.getCurrentBookId()).number;
            },
            sortResults: function(a, b) {
                emmetUtils.getCollator().compare(a.songNumber, b.songNumber);
            },
        },
        full: {
            name: "teljes keresés",
            getLyricsToSearchIn: function(allSongs, languages) {
                return allSongs.map(s => {return {
                    song: s,
                    lyrics: s.lyrics.filter(l => languages.includes(l.lang)),
                }})
            },
            addSongMetadataToResult: function(song, langObj, searchResultObj) {
                searchResultObj["lang"] = langObj.lang;
                searchResultObj["country"] = emmetUtils.getCountryOfLang(langObj.lang);
            },
            sortResults: function(a, b) {
                emmetUtils.getCollator().compare(a.title, b.title);
            }
        }
    };

    var wordMatchingModes = {
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
    };

    var getSearchRegexp = function(searchExpr, wordMatchingMode) {
        var searchExprTokenized = emmetTokenizer.tokenize(searchExpr);
        if (searchExprTokenized == null) {throw "emptySearch"};
        var searchRegexp = wordMatchingMode.addRegexpBoundaries(searchExprTokenized);
        return new RegExp(searchRegexp, "gi");
    };

    var createTitleResult = function(song, langObj, searchMode, highlightedTitle) {
        var titleResult = {
            internalSongId: song.internalId,
            langId: langObj.langId,
            title: langObj.title,
            highlightedTitle: highlightedTitle,
            hasRecords: song.records !== undefined,
        };
        searchMode.addSongMetadataToResult(song, langObj, titleResult);
        return titleResult;
    };

    // This is temporary, should be replaced with lib
    var getHighlightRegexp = function(searchExpr, wordMatchingMode) {
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
        // Apply word matching mode
        str = wordMatchingMode.addRegexpBoundaries(str);
        return new RegExp(str, "gi");
    };

    return {
        search: function(searchExpr, searchModeStr, wordMatchingModeStr, languages) {
            var searchMode = searchModes[searchModeStr];
            var wordMatchingMode = wordMatchingModes[wordMatchingModeStr];

            try {
                var searchRegexp = getSearchRegexp(searchExpr, wordMatchingMode);
            } catch (e) {
                if (e == "emptySearch") {
                    emmetNotifier.showError("Érvénytelen keresés",
                        "Kérünk, olyan keresőkifejezést adj meg, amiben szerepelnek betűk vagy számok!"
                    );
                    return;
                } else {throw e;}
            }
            var highlightRegexp = getHighlightRegexp(searchExpr, wordMatchingMode);

            var searchRange = searchMode.getLyricsToSearchIn(emmetSongData.getAllSongs(), languages);

            var titleResults = [];
            var textResults = [];
            for (let searchRangeEntry of searchRange) {
                let songInScope = searchRangeEntry.song;
                for (let lyricsInScope of searchRangeEntry.lyrics) {
                    // Search in title
                    var highlightedTitle = lyricsInScope.title;
                    if (searchRegexp.test(lyricsInScope.tokenizedTitle)) {
                        highlightedTitle = lyricsInScope.title.replace(highlightRegexp, "<mark>$1</mark>");
                        titleResults.push(createTitleResult(songInScope, lyricsInScope, searchMode, highlightedTitle));
                    }

                    // Search in text
                    let textResult;
                    for (let verseInScope of lyricsInScope.verses) {
                        if (! searchRegexp.test(verseInScope.tokenizedLines)) {
                            continue;
                        }
                        if (textResult === undefined) {
                            textResult = createTitleResult(songInScope, lyricsInScope, searchMode, highlightedTitle);
                            textResult["highlightedVerses"] = [];
                            textResults.push(textResult);
                        }
                        textResult.highlightedVerses.push({
                            displayName: verseInScope.displayName,
                            isChorus: verseInScope.isChorus,
                            isBridge: verseInScope.isBridge,
                            lines: verseInScope.lines.map(l => l.replace(highlightRegexp, "<mark>$1</mark>")),
                        });
                    }
                }
            }

            titleResults.sort(searchMode.sortResults);
            textResults.sort(searchMode.sortResults);

            var resultsHtml = mustache.to_html(emmetUtils.getTemplate("search"), {
                searchExpr: searchExpr,
                searchMode: searchMode.name.charAt(0).toUpperCase() + searchMode.name.slice(1),
                numOfResults: titleResults.length + textResults.length,
                wordMatchingMode: wordMatchingMode.name,
                hasTitleResults: (titleResults.length > 0), 
                titleResults: titleResults,
                numOfTitleResults: titleResults.length,
                hasTextResults: (textResults.length > 0), 
                textResults: textResults,
                numOfTextResults: textResults.length,
            });
            $("#emmet-p-search").html(resultsHtml);
            $("#emmet-p-search a.emmet-search-item").click(function(e) {
                e.preventDefault();
                var internalSongId = Number($(this).data("songid"));
                var langId = Number($(this).data("langid"))
                emmetSongDisp.displaySongByInternalId(internalSongId, langId);
            });
            $("#emmet-search-modal").modal("hide");
            emmetUtils.showPage("search");
        },
    };
});