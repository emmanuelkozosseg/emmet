<?php
if (! file_exists("songs.json")) {
    die("ERROR: songs.json doesn't exist. Please visit refresh-songs.php to generate it from the OpenSong source.");
}

ob_start("ob_gzhandler");
echo file_get_contents("songs.json");
ob_end_flush();
