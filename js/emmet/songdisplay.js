define(['emmet/notifier', 'emmet/songdata', 'emmet/utils', 'mustache'],
function(emmetNotifier, emmetSongData, emmetUtils, mustache) {
    return {
        displaySong: function(songId) {
            // Remove leading zeroes
            songId = songId.replace(/^0+/, "");
            
            var songBook = emmetSongData.getCurrentBook();
            if (! songBook.songs.hasOwnProperty(songId)) {
                emmetNotifier.showError(
                        "Hiányzó ének",
                        "Nincs <strong>"+songId+"</strong>. számú ének a kiválasztott énekeskönyvben ("+songBook.name+").");
                return;
            }
            
            var song = songBook.songs[songId];
            var songHtml = mustache.to_html(emmetUtils.getTemplate("song"), song);
            $("#emmet-song-modal .modal-content").html(songHtml);
            $("#emmet-song-modal").modal();
        },
    };
});