define(['emmet/utils', 'jquery', 'mustache'],
function(emmetUtils, _j, mustache) {
    var nextPlayerId = 1;

    var timeToText = function(timeNumber) {
        function padWithZeroes(str) {
            if (str.toString().length == 1) {return "0" + str;}
            return str;
        }
        var minutes = Math.floor(timeNumber/60);
        return minutes + ":" + padWithZeroes(Math.floor(timeNumber-minutes*60));
    }

    return {
        create: function(target) {
            var playerId = nextPlayerId++;

            // Populate HTML
            var controlsHtml = mustache.render(emmetUtils.getTemplate("songplayer"), {
                playerId: playerId,
            });
            target.html(controlsHtml);

            // Internal variables & methods
            var loaded = false;
            var playing = false;
            var audio = $("#emmet-song-player-"+playerId+" audio");

            function play(url) {
                audio.attr("src", url);
                audio[0].load();
                audio[0].oncanplaythrough = audio[0].play();
                $("#emmet-song-player-"+playerId+" .play-btn").prop("disabled", false);
                $("#emmet-song-player-"+playerId+" .play-btn .oi").removeClass("oi-media-play").addClass('oi-media-pause');
                $("#emmet-song-modal .emmet-song-play-progress").removeClass("d-none");
                loaded = true;
                playing = true;
            }

            function playPause() {
                if (playing) {
                    audio[0].pause();
                    $("#emmet-song-player-"+playerId+" .play-btn .oi").removeClass("oi-media-pause").addClass('oi-media-play');
                    playing = false;
                } else {
                    audio[0].play();
                    $("#emmet-song-player-"+playerId+" .play-btn .oi").removeClass("oi-media-play").addClass('oi-media-pause');
                    playing = true;
                }
            }

            function destroy() {
                audio.remove();
            }

            function updateProgress() {
                var currentTime = audio[0].currentTime;
                var duration = audio[0].duration;
                if (isNaN(duration)) {
                    $("#emmet-song-player-"+playerId+" .media-title").text("-:--")
                    $("#emmet-song-player-"+playerId+" .progress-text").text("-:--");
                    $("#emmet-song-player-"+playerId+" .progress-bar").width("0%");
                    return;
                }
                $("#emmet-song-player-"+playerId+" .progress-bar").width((currentTime/duration*100)+"%");
                $("#emmet-song-player-"+playerId+" .media-title").text(timeToText(currentTime));
                $("#emmet-song-player-"+playerId+" .progress-text").text(timeToText(duration));
                $("#emmet-song-modal .emmet-song-play-progress .progress-bar").width((currentTime/duration*100)+"%");
            }

            // Add triggers
            audio.bind('timeupdate', updateProgress);
            audio.bind('ended', playPause);
            $("#emmet-song-player-"+playerId+" .play-btn").click(playPause);
            $("#emmet-song-player-"+playerId+" .progress").click(function(e) {
                if (! loaded) {return;}
                var clickedPoint = e.pageX - $(this).offset().left;
                var progressWidth = $(this).width();
                audio[0].currentTime = clickedPoint/progressWidth * audio[0].duration;
            });

            return {
                play: play,
                destroy: destroy,
                isPlaying: () => playing,
            };
        },
    };
});