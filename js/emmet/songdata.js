define([], function() {
    var songData = null;
    var currentBook = "emm_hun";

    return {
        getCurrentBook: function() {
            return songData[currentBook];
        },
        getCurrentBookId: function() {
            return currentBook;
        },
        getBook: function(bookId) {
            return songData[bookId];
        },
        getBookIds: function() {
            return Object.keys(songData);
        },
        setBook: function(newBookId) {
            currentBook = newBookId;
        },
        setData: function(data) {
            songData = data;
        },
    };
})