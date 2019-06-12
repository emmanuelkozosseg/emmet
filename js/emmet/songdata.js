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
    };
})