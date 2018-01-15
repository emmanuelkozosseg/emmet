emmet.songDisplay = (function() {
    return {
        displaySong: function(songId) {
            // Remove leading zeroes
            songId = songId.replace(/^0+/, "");
            
            var songBook = emmet.main.getCurrentBook();
            if (! songBook.songs.hasOwnProperty(songId)) {
                emmet.notifier.showError(
                        "Hiányzó ének",
                        "Nincs <strong>"+songId+"</strong>. számú ének a kiválasztott énekeskönyvben ("+songBook.name+").");
                return;
            }
            
            var song = songBook.songs[songId];
            var songHtml = Mustache.to_html(emmet.main.getTemplate("song"), song);
            $("#emmet-song-modal .modal-content").html(songHtml);
            $("#emmet-song-modal").modal();
        },
    };
})();