<?php
function to_busted_url($url) {
    return $url."?bust=".filemtime($url);
}
?>
<!doctype html>
<html lang="en">
<head>
<!-- Required meta tags -->
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
<!-- Bootstrap CSS -->
<link rel="stylesheet" href="<?php print(to_busted_url("css/bootstrap.min.css")); ?>" />
<link rel="stylesheet" href="<?php print(to_busted_url("css/emmet.css")); ?>" />
<link rel="stylesheet" href="<?php print(to_busted_url("css/flags/flags.min.css")); ?>" />
<link rel="stylesheet" href="<?php print(to_busted_url("css/iconic/css/open-iconic-bootstrap.min.css")); ?>">
<title>Emmet - Emmánuel Énektár</title>
</head>
<body>
    <div id="emmet-loading"><div>
        <img src="img/logo.png" class="emmet-loading-logo" />
        <p class="emmet-loading-text">Énekek betöltése...</p>
    </div></div>
    
    <div class="container">
        <?php require("incl/nav.html"); ?>
        <?php require("incl/main.html"); ?>
    </div>
    
    <?php require("incl/modals.html"); ?>
    <?php require("incl/templates.html"); ?>
    
    <script>
        var emmet_busts = { <?php
            $dirs_to_scan = array("js/emmet");
            foreach ($dirs_to_scan as $dir) {
                foreach (scandir($dir) as $filename) {
                    if (substr($filename, -3) != ".js") {
                        continue;
                    }
                    $path = $dir."/".$filename;
                    $last_mod_time = filemtime($path);
                    print("'$path': $last_mod_time, ");
                }
            }
        ?> };
    </script>
    <script data-main="js/main" src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.js" integrity="sha256-lIXwkX+X/PT2Ol6jZSAP/VfxI/RROCovmhrS4v1RrJs=" crossorigin="anonymous"></script>
</body>
</html>