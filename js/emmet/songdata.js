define([], function() {
    var songData = null;
    var currentBook = "emm_hu";
    var availableLanguages = null;

    var getMainLangIdOfSong = function(song) {
        var currentBookEntry = song.books.find(b => b.id == currentBook);
        if (currentBookEntry === undefined) {
            return 0;
        }
        return song.lyrics.findIndex(e => e.lang == currentBookEntry.lang);
    };

    return {
        getCurrentBook: function() {
            return songData.books[currentBook];
        },
        getCurrentBookId: function() {
            return currentBook;
        },
        getSongFromCurrentBook: function(songNumber) {
            var songBook = songData.books[currentBook];
            var songNumberLc = songNumber.toLowerCase().trim();
            if (! songNumberLc) {
                throw {name: "empty", message: "Hiányzó énekszám!"};
            }
            if (! songBook.songs.hasOwnProperty(songNumberLc)) {
                throw {name: "missing", message: "Ismeretlen énekszám!"};
            }
            return songBook.songs[songNumberLc];
        },
        getBook: function(bookId) {
            return songData.books[bookId];
        },
        getBookIds: function() {
            return Object.keys(songData.books);
        },
        getBookList: function() {
            return songData.bookList;
        },
        getAllSongs: function() {
            return songData.songs;
        },
        getAvailableLanguages: function() {
            return availableLanguages;
        },
        setBook: function(newBookId) {
            currentBook = newBookId;
        },

        setData: function(data) {
            songData = data;

            var langsAndOccurrances = new Map();
            for (let song of songData.songs) {
                for (let lyrics of song.lyrics) {
                    langsAndOccurrances[lyrics.lang] = (langsAndOccurrances[lyrics.lang] || 0) + 1;
                }
            }
            availableLanguages = Object.keys(langsAndOccurrances).sort((a, b) => langsAndOccurrances[b] - langsAndOccurrances[a]);
        },

        getMainLangIdOfSong: getMainLangIdOfSong,
        getMainLangOfSong: function(song) {
            return song.lyrics[getMainLangIdOfSong(song)];
        },
        getVersesInDefinedOrder: function(lang) {
            return 'order' in lang
                ? lang.order.map((verseName, index) => {
                    var verse = lang.verses.find(v => v.name == verseName);
                    var newVerse = Object.assign({}, verse);
                    newVerse.verseId = index;
                    return newVerse;
                })
                : lang.verses;
        }
    };
})