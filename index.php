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
<link rel="stylesheet" href="<?php print(to_busted_url("css/jquery.audioplayer/jquery.audioplayer.css")); ?>">
<title>Emmet - Emmánuel Énektár</title>
</head>
<body>
    <div id="emmet-loading"><div>
        <img src="img/logo.png" class="emmet-loading-logo" />
        <p class="emmet-loading-text">Betöltés...</p>
    </div></div>
    
    <div class="container">
        <?php require("incl/nav.html"); ?>
        <?php require("incl/main.html"); ?>
    </div>
    
    <?php
    require("incl/modals.html");
    foreach (scandir("incl/templates") as $template_file) {
        if (substr($template_file, -5) != ".html") {
            continue;
        }
        $template_id = substr($template_file, 0, strlen($template_file)-5);
        print("\n<script type=\"x-emmet-template\" id=\"emmet-tmpl-$template_id\">\n");
        require("incl/templates/$template_file");
        print("\n</script>\n");
    }
    ?>

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
    <script data-main="js/main" src="js/lib/require.2.3.6.min.js" integrity="sha256-1fEPhSsRKlFKGfK3eO710tEweHh1fwokU5wFGDHO+vg=" crossorigin="anonymous"></script>
</body>
</html>