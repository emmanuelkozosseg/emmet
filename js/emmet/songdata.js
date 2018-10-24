define([], function() {
    var songData = null;
    var currentBook = "emmet";

    return {
        getCurrentBook: function() {
            return songData['books'][currentBook];
        },
        getCurrentBookId: function() {
            return currentBook;
        },
        getBook: function(bookId) {
            return songData['books'][bookId];
        },
        getBookIds: function() {
            return Object.keys(songData['books']);
        },
        setBook: function(newBookId) {
            currentBook = newBookId;
        },
        setData: function(data) {
            songData = data;
        },

        getMainLangIdOfSong: function(song) {
            var bookLangOrder = songData['books'][currentBook].languages;
            for (let lang of bookLangOrder) {
                var langId = song.lyrics.findIndex(e => {
                    return e.lang == lang;
                });
                if (langId != -1) {
                    return langId;
                }
            }
            return 0;
        },
    };
})