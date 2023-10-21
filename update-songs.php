<?php

// Get latest commit's ID on master branch
$commits = json_decode(file_get_contents("https://api.bitbucket.org/2.0/repositories/eckerg/emmert/commits/master?pagelen=1"));
$lastCommit = array(
    "hash" => $commits->values[0]->hash,
    "date" => (new DateTimeImmutable($commits->values[0]->date))->format("Y.m.d.")
);
print("Latest commit on Bitbucket master branch: {$lastCommit["hash"]} ({$lastCommit["date"]})<br>");

// Get latest commit downloaded
$lastDlCommit = file_exists("songs.json.lastcommit") ? json_decode(file_get_contents("songs.json.lastcommit")) : "[N/A]";
print("Latest commit as of the last refresh: {$lastDlCommit->hash} ({$lastDlCommit->date})<br>");

if ($lastCommit["hash"] == $lastDlCommit->hash) {
    print("No change since last refresh. Exiting.<br>");
    exit();
}
print("The repo has been changed. Proceeding with refresh.<br>");

print("Updating songs.json...<br>");
$songsJsonFp = fopen("songs.json", "w");
try {
    $curl = curl_init("https://bitbucket.org/eckerg/emmert/downloads/emmet.json");
    curl_setopt($curl, CURLOPT_FILE, $songsJsonFp);
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($curl, CURLOPT_FORBID_REUSE, TRUE);
    curl_exec($curl);
    $st_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
} finally {
    fclose($songsJsonFp);
}
if($st_code != 200) {
    die("ERROR: Failed to download songs.json: $st_code");
}

print("Updating last retrieved commit...<br>");
file_put_contents("songs.json.lastcommit", json_encode($lastCommit));

print("songs.json has been successfully updated.<br>");
