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
        <!-- Navigation -->
        <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top">
            <a id="emmet-nav-mainlink" class="navbar-brand" href="#">
                <img src="img/logo.png" />
            </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle font-weight-bold" href="#" id="emmetNavbarDropdown" role="button"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Könyvek
                        </a>
                        <div id="emmet-nav-bookselector" class="dropdown-menu" aria-labelledby="emmetNavbarDropdown"></div>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" id="emmet-toc-link">Tartalomjegyzék</a>
                    </li>
                </ul>
                <form id="emmet-form-jumpto" class="form-inline my-2 my-lg-0 mr-3">
                    <input id="emmet-jumpto-songno" class="form-control mr-sm-2" type="search" placeholder="Énekszám" aria-label="Énekszám">
                    <button class="btn btn-primary my-2 my-sm-0" type="submit">Ugrás</button>
                </form>
                <form id="emmet-form-search" class="form-inline my-2 my-lg-0 mr-3">
                    <input id="emmet-search-expr" class="form-control mr-sm-2" type="search" placeholder="Keresés" aria-label="Keresés">
                    <!-- <button class="btn btn-primary my-2 my-sm-0" type="submit">Keresés</button> -->
                    <div class="btn-group my-2 my-sm-0">
                        <button id="emmet-search-wholeword" type="button" class="btn btn-primary">Keresés</button>
                        <button type="button" class="btn btn-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span class="sr-only">Toggle Dropdown</span>
                        </button>
                        <div class="dropdown-menu">
                            <a id="emmet-search-partword" class="dropdown-item" href="#">Törtszavas</a>
                        </div>
                    </div>
                </form>
            </div>
        </nav>
        
        <!-- Body -->
        <main class="p-3">
            <div id="emmet-p-main" class="emmet-page">
                <div class="row"><div class="col">
                    <h2 class="mb-3">Üdv az Emmánuel Énektárban!</h2>
                    
                    <h4 class="mt-4 mb-1">Énekeskönyvek</h4>
                    <p>Az Emmet több énekeskönyvet is támogat, de egyszerre csak egy lehet nyitva. A könyvek menüjében tudsz váltani közöttük.
                    Indításkor mindig a magyar énekeskönyv nyílik ki.</p>
                    <p>A tartalomjegyzék mindig csak az éppen nyitott könyv énekeit tartalmazza, és az ugrás/keresés is mindig csak az aktuális
                    könyvben keres.</p>
                    
                    <h4 class="mt-4 mb-1">Böngészés</h4>
                    <ul>
                        <li>A <strong>Tartalomjegyzék</strong> menüpontban a kiválasztott énekeskönyv összes dala között böngészhetsz.</li>
                        <li>Ha tudod egy ének számát, közvetlenül rákereshetsz az <strong>Énekszám</strong> mezőben.</li>
                    </ul>
                    
                    <h4 class="mt-4 mb-1">Keresés</h4>
                    <p>Dalszöveg vagy cím alapján is kereshetsz a <strong>Keresés</strong> mezőben.</p>
                    <ul>
                        <li>Kis- és nagybetű, ékezetes karakter és írásjelek nem számítanak.</li>
                        <li>Ha több szót írsz be, azokra az Emmet egyben keres (tehát az összes szónak, abban a sorrendben, és megszakítás
                        nélkül kell szerepelnie).</li>
                        <li>Alapértelmezésben a kereső teljes szavakra keres. Ha tört szavakra is keresni szeretnél, nyisd ki a legördülő
                        menüt és válaszd a <strong>Törtszavas</strong> lehetőséget.
                        <span class="text-muted">Például az <strong>Úr</strong> keresésre az <strong>Uram</strong> találatot a törtszavas
                        keresés visszaadja, az alapértelmezett teljes szavas viszont nem.</span></li>
                    </ul>
                    
                    <h4 class="mt-4 mb-1">Hogyan segíthetsz?</h4>
                    <ul>
                        <li>Az Emmet nyílt forráskódú, <a href="https://bitbucket.org/eckerg/emmet">a Bitbucketen</a> beszállhatsz
                        a fejlesztésébe.</li>
                        <li>Az énekek szövegeit <a href="https://bitbucket.org/eckerg/emmet-enekek">szintén a Bitbucketen</a> találod meg.
                        Ha valamin javítani szeretnél, ott saját magad is megteheted, ha ismered az OpenSong fájlformátumát.</li>
                        <li>Ha hibát, elírást, stb. találsz, kérünk, jelentsd be, hogy kijavíthassuk! Az Emmet hibáit
                        <a href="https://bitbucket.org/eckerg/emmet/issues">itt</a>, az énekszövegek hibáit
                        <a href="https://bitbucket.org/eckerg/emmet-enekek/issues">itt</a> jelentheted. Köszönjük!</li>
                    </ul>
                </div></div>
            </div>
            
            <div id="emmet-p-toc" class="emmet-page">
                <h2 class="mb-3">Tartalomjegyzék</h2>
                <div class="emmet-toc-sortby btn-group btn-group-toggle mb-3" data-toggle="buttons">
                    <label class="btn btn-primary active">
                        <input type="radio" name="emmet-toc-sortby" value="num" autocomplete="off" checked> Énekszám szerint
                    </label>
                    <label class="btn btn-primary">
                        <input type="radio" name="emmet-toc-sortby" value="title" autocomplete="off"> Cím szerint
                    </label>
                </div>
                <div class="emmet-toc-list list-group"></div>
            </div>
            
            <div id="emmet-p-search" class="emmet-page"></div>
        </main>
    </div>
    
    <!--
        Modals
    -->
    
    <div id="emmet-song-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
            </div>
        </div>
    </div>
    
    <div id="emmet-error-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header bg-danger">
                    <h5 class="modal-title"></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body"></div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Bezárás</button>
                </div>
            </div>
        </div>
    </div>
    
    <div id="emmet-fatal-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content bg-danger">
                <div class="modal-header">
                    <h5 class="modal-title"></h5>
                </div>
                <div class="modal-body"></div>
            </div>
        </div>
    </div>
    
    <!--
        Mustache templates
    -->
    
    <template id="emmet-tmpl-booklist" class="emmet-template">
        <h6 class="dropdown-header">Másik könyv megnyitása</h6>
        {{#.}}
        <a class="dropdown-item" href="#" data-bookid="{{id}}">{{name}}</a>
        {{/.}}
    </template>
    
    <template id="emmet-tmpl-toc-list" class="emmet-template">
        {{#.}}
        <a href="#" class="list-group-item list-group-item-action emmet-toc-item p-2" data-songnumber="{{number}}">
            <span class="badge badge-info">{{number}}</span> {{title}}
        </a>
        {{/.}}
    </template>
    
    <template id="emmet-tmpl-song" class="emmet-template">
        <div class="modal-header bg-secondary">
            <h5 class="modal-title">
                <span class="badge badge-info">{{currentNumber}}</span>
                <span class="emmet-song-title"></span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="emmet-song-toolbar">
            <ul class="nav nav-tabs">
                <li class="nav-item dropdown emmet-song-lang-select">
                    <a class="nav-link {{#isSingleLanguage}}disabled{{/isSingleLanguage}} dropdown-toggle emmet-lang-btn" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                        <img src="css/flags/blank.gif" class="flag" />
                        <span class="emmet-langname emmet-lang-tag"></span>
                    </a>
                    <div class="dropdown-menu">
                        {{#languages}}
                        <a class="dropdown-item emmet-song-lang-select-{{id}}" href="#" data-langid="{{id}}">
                            <img src="css/flags/blank.gif" class="flag flag-{{country}}" alt="{{name}}" />
                            <span class="emmet-lang-tag">{{name}}</span> &ndash; {{title}}
                        </a>
                        {{/languages}}
                    </div>
                </li>
                <li class="nav-item emmet-song-lyrics-btn">
                    <a class="nav-link" href="#" title="Dalszöveg">
                        <span class="oi oi-musical-note"></span>
                    </a>
                </li>
                <li class="nav-item emmet-song-details-btn">
                    <a class="nav-link" href="#" title="Részletek">
                        <span class="oi oi-document"></span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link disabled" href="javascript:" title="Lejátszás">
                        <span class="oi oi-media-play"></span>
                    </a>
                </li>
            </ul>
        </div>
        <div class="modal-body">
            <div class="emmet-song-tab emmet-song-lyrics" data-trigger="emmet-song-lyrics-btn">
                {{#song.lyrics}}
                <div class="emmet-song-lang emmet-song-lang-{{langId}}">
                    <div class="emmet-song">
                        {{#verses}}
                        <div class="emmet-song-verse">
                            <div class="emmet-header{{#isChorus}} emmet-chorus{{/isChorus}}{{#isBridge}} emmet-bridge{{/isBridge}}"
                                >{{displayName}}</div>
                            <div class="emmet-body{{#isChorus}} emmet-chorus{{/isChorus}}">
                                {{#lines}}
                                <p>{{.}}</p>
                                {{/lines}}
                            </div>
                        </div>
                        {{/verses}}
                    </div>
                </div>
                {{/song.lyrics}}
            </div>
            <div class="emmet-song-tab emmet-song-details" data-trigger="emmet-song-details-btn">
                <table class="table table-sm table-hover"><tbody>
                    <!--
                    <tr class="table-secondary">
                        <th colspan="2">Zenei részletek</th>
                    </tr>
                    <tr>
                        <th width="50%" scope="row">Hangnem</td>
                        <td width="50%">ismeretlen</td>
                    </tr>
                    <tr>
                        <th class="align-middle" scope="row">Kezdőhang</td>
                        <td class="align-middle">
                            ismeretlen
                            <button type="button" class="btn btn-sm btn-primary ml-1" data-toggle="button" disabled>
                                <span class="oi oi-media-play"></span>
                            </button>
                        </td>
                    </tr>
                    -->
                    <tr class="table-secondary">
                        <th colspan="2">A dal a következő könyvekben szerepel:</th>
                    </tr>
                    <!-- {{#books}} -->
                    <tr>
                        <td>{{name}}</td>
                        <td><span class="badge badge-info">{{number}}</span></td>
                    </tr>
                    <!-- {{/books}} -->
                </tbody></table>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Bezárás</button>
        </div>
    </template>
    
    <template id="emmet-tmpl-search" class="emmet-template">
        <h2 class="mb-3">Keresés</h2>
        <p>Összesen <strong>{{numOfResults}}</strong> {{searchMode}} találat a(z) <strong>{{searchExpr}}</strong> kifejezésre.</p>
        
        <h4>Dalok címében ({{numOfTitleResults}})</h4>
        {{#hasTitleResults}}
        <div class="list-group mb-3">
        {{#titleResults}}
            <a href="#" class="emmet-search-item list-group-item list-group-item-action emmet-toc-item p-2" data-songnumber="{{number}}">
                <span class="badge badge-info">{{number}}</span> {{{title}}}
            </a>
        {{/titleResults}}
        </div>
        {{/hasTitleResults}}
        {{^hasTitleResults}}
        <div class="alert alert-primary" role="alert">Nincs találat.</div>
        {{/hasTitleResults}}
        
        <h4>Dalok szövegében ({{numOfTextResults}})</h4>
        {{#hasTextResults}}
        <div class="list-group mb-3">
        {{#textResults}}
            <a href="#" class="emmet-search-item list-group-item list-group-item-action" data-songnumber="{{number}}">
                <h5 class="mb-2"><span class="badge badge-info">{{number}}</span> {{title}}</h5>
                <div class="emmet-song">
                    {{#matchedVerses}}
                    <div class="emmet-song-verse">
                        {{#displayName}}
                        <div class="emmet-header{{#isChorus}} emmet-chorus{{/isChorus}}{{#isBridge}} emmet-bridge{{/isBridge}}">{{.}}</div>
                        {{/displayName}}
                        <div class="emmet-body{{#isChorus}} emmet-chorus{{/isChorus}}">
                            {{#lines}}
                            <p>{{{.}}}</p>
                            {{/lines}}
                        </div>
                    </div>
                    {{/matchedVerses}}
                </div>
            </a>
        {{/textResults}}
        </div>
        {{/hasTextResults}}
        {{^hasTextResults}}
        <div class="alert alert-primary" role="alert">Nincs találat.</div>
        {{/hasTextResults}}
    </template>
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