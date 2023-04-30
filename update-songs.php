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
file_put_contents("songs.json", fopen("https://bitbucket.org/eckerg/emmert/downloads/emmet.json", 'r'));

print("Updating last retrieved commit...<br>");
file_put_contents("songs.json.lastcommit", json_encode($lastCommit));

print("songs.json has been successfully updated.<br>");
