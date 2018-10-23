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
    };
})