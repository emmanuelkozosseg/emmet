<?php
function to_busted_css_url($url) {
    return str_replace(".css", ".".filemtime($url).".css", $url);
}
?>
<!doctype html>
<html lang="hu">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="theme-color" content="#222" />
    <meta name="google" content="notranslate" />
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="<?php print(to_busted_css_url("css/bootstrap.min.css")); ?>" />
    <link rel="stylesheet" href="<?php print(to_busted_css_url("css/emmet.css")); ?>" />
    <link rel="stylesheet" href="<?php print(to_busted_css_url("css/flags/flags.min.css")); ?>" />
    <link rel="stylesheet" href="<?php print(to_busted_css_url("css/iconic/css/open-iconic-bootstrap.min.css")); ?>">
    <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
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
        // Report errors during load
        function emmetPreLoadErrorHandler(e) {
            alert([
                "Hiba történt az Emmet betöltése közben.",
                "Kérünk, küldd el a lenti részleteket az ecker pont gabor kukac gmail pont com e-mail címre!",
                "",
                "Error message: " + e.message,
                "URL: " + e.filename,
                "Line number: " + e.lineno,
                "Column number: " + e.colno,
            ].join("\n"));
        }
        window.addEventListener("error", emmetPreLoadErrorHandler);

        // Generate busts for .js files
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
    <script data-main="js/main.<?php print(filemtime("js/main.js")); ?>" src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js" integrity="sha256-1fEPhSsRKlFKGfK3eO710tEweHh1fwokU5wFGDHO+vg=" crossorigin="anonymous"></script>
    <script>window.require || document.write('<script data-main="js/main.<?php print(filemtime("js/main.js")); ?>" src="js/lib/require.2.3.6.min.js"><\/script>')</script>
</body>
</html>
