<?php
/*
 * Book descriptor (songbooks.ini):
 *  - section (any name, must be unique, doesn't appear anywhere)
 *      - name
 *      - language (ISO 639-1)
 *      - path
 * 
 * Schema:
 *  - books: id => {
 *      - id
 *      - name
 *      - language
 *      - songs: number => {
 *          - title
 *          - number
 *          - verses[]: {
 *              - code
 *              - lines[]
 *          }
 *      }
 *  }
 */

function download_latest_songs_if_needed() {
    // Get latest commit's ID on master branch
    $commits = json_decode(file_get_contents("https://api.bitbucket.org/2.0/repositories/eckerg/emmet-enekek/commits/master?pagelen=1"));
    $lastCommit = $commits->values[0]->hash;
    print("Latest commit on Bitbucket master branch: $lastCommit<br>");
    
    // Get latest commit downloaded
    $lastDlCommit = file_exists("songs/last_retrieved_commit") ? file_get_contents("songs/last_retrieved_commit") : "[N/A]";
    print("Latest commit as of the last refresh: $lastDlCommit<br>");
    
    if ($lastCommit == $lastDlCommit) {
        print("No change since last refresh. Exiting.<br>");
        exit();
    }
    print("The repo has been changed. Proceeding with refresh.<br>");
    
    print("Clearing song directory...<br>");
    array_map('unlink', glob("songs/*"));
    
    print("Downloading repo to songs/master.zip...<br>");
    file_put_contents("songs/master.zip", fopen("https://bitbucket.org/eckerg/emmet-enekek/get/HEAD.zip", 'r'));
    
    print("Extracting zip file...<br>");
    $zip = new ZipArchive;
    $res = $zip->open('songs/master.zip');
    if ($res === TRUE) {
        $zip->extractTo('songs/zip');
        $zip->close();
    } else {
        die("Failed to extract the file: $res");
    }
    
    // Move out all files
    $zip_1st_lvl_folder_name = array_values(array_diff(scandir("songs/zip"), array('..', '.')))[0];
    $delete = array();
    foreach (scandir("songs/zip/$zip_1st_lvl_folder_name") as $file) {
        if (in_array($file, array(".",".."))) {continue;}
        rename("songs/zip/$zip_1st_lvl_folder_name/$file", "songs/$file");
    }
    rmdir("songs/zip/$zip_1st_lvl_folder_name");
    rmdir("songs/zip");
    
    print("Updating last retrieved commit...<br>");
    file_put_contents("songs/last_retrieved_commit", $lastCommit);
}

function read_songs($subdir) {
    // Get all files in this subdir
    $dirContents = scandir($subdir);
    
    $songList = array();
    foreach ($dirContents as $fileName) {
        $filePath = $subdir."/".$fileName;
        
        // Skip if not a regular file
        if (! is_file($filePath)) {continue;}
        
        $song = read_song($filePath);
        $songList[$song["number"]] = $song;
    }
    return $songList;
}

function read_song($filePath) {
    static $unnumberedSequence = 0;
    
    $xml = simplexml_load_file($filePath);
    
    $songTitle = trim((string) $xml->title);
    $songNumber = trim((string) $xml->hymn_number);
    
    if ($songNumber) {
        // Remove leading zeroes
        $songNumber = preg_replace("/^0+/", "", $songNumber);
    } else {
        $songNumber = "ZZZZZ::EMMET-AUTO::".$songTitle."::".$unnumberedSequence;
        $unnumberedSequence++;
    }
    
    return array(
            "title" => $songTitle,
            "number" => $songNumber,
            "verses" => parse_verses((string) $xml->lyrics),
    );
}

function get_original_verse($verseCode) {
    if ($verseCode[0] != "V" || strlen($verseCode) < 3) {
        return $verseCode;
    }
    return substr($verseCode, 0, 2);
}

function parse_verses($verseStr) {
    $separator = "\r\n";
    $line = strtok($verseStr, $separator);
    $verses = array();
    $currentVerse = null;
    while ($line !== false) {
        $matches = array();
        
        if (preg_match('/^\[([^\]]+)\]/', $line, $matches)) {
            // THIS IS A VERSE HEADER
            $verseCode = $matches[1];
            unset($currentVerse);
            
            // ...but if its code is like 'V22', then this belongs to V2 in reality
            // Let's check
            $originalVerseCode = get_original_verse($verseCode);
            $createNewVerse = true;
            if ($originalVerseCode != $verseCode) {
                // Yep, this belongs to another verse
                // Look up original verse
                $originalVerseIndex = null;
                for ($i = 0; $i < count($verses); $i++) {
                    if ($verses[$i]["code"] == $originalVerseCode) {
                        $originalVerseIndex = $i;
                        break;
                    }
                }
                if ($originalVerseIndex !== null) {
                    // We've found it, let's use this
                    $currentVerse = &$verses[$originalVerseIndex];
                    $currentVerse["lines"][] = "";
                    $createNewVerse = false;
                } else {
                }
            }
            
            if ($createNewVerse) {
                // Create a verse
                $verses[] = array(
                        "code" => $verseCode,
                        "lines" => array(),
                );
                $currentVerse = &$verses[count($verses)-1];
            }
        } else if (preg_match('/^ (.+)$/', $line, $matches)) {
            // THIS IS A LYRIC LINE
            // Handle line breaks
            if ($line == " |" || $line == " ||") {
                $line = "";
            }
            // If this is an anonymous verse, let's add it without header
            if (! $currentVerse) {
                $verses[] = array(
                        "code" => "A",
                        "lines" => array(),
                );
                $currentVerse = &$verses[count($verses)-1];
            }
            // Add this line as a lyric line
            $currentVerse["lines"][] = trim($line);
        }
        
        $line = strtok($separator);
    }
    
    return $verses;
}

///////////////////////////
////////// START //////////
///////////////////////////

// Replace songs if needed
download_latest_songs_if_needed();

print("Generating song JSON...<br>");

// Read songbook descriptor
$iniFile = parse_ini_file("songs/emmet-songbooks.ini", true);
$json = array();
// Collect songs
foreach ($iniFile as $bookId => $bookData) {
    $songs = read_songs("songs/".$bookData["path"]);
    $json[$bookId] = array(
            "id" => $bookId,
            "name" => $bookData["name"],
            "language" => $bookData["language"],
            "songs" => $songs,
    );
}

// Write results to file
file_put_contents("songs.json", json_encode($json));

print("Song JSON has been successfully generated and dumped to songs.json.");
