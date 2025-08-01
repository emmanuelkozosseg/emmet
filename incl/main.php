<main class="p-3">
    <div id="emmet-p-main" class="emmet-page">
        <div class="emmet-logo"><div>
            <img src="img/logo.png" alt="Emmet" />
            <span>Emmánuel Énektár</span>
        </div></div>

        <div class="emmet-main-forms">
            <hr />
            <a href="#" class="emmet-p-main-toc-btn btn btn-primary emmet-form-block" role="button">Tartalomjegyzék</a>
            <h5>Ének megnyitása</h5>
            <form class="form-inline emmet-form-block emmet-form-jumpto">
                <div class="input-group">
                    <input class="form-control emmet-jumpto-songno" type="search" placeholder="Énekszám" size="8" />
                    <button class="btn btn-primary" type="submit"><span class="oi oi-share"></span></button>
                </div>
            </form>
            <h5>Keresés</h5>
            <form class="form-inline emmet-form-block emmet-form-search">
                <div class="input-group">
                    <input class="form-control emmet-search-expr" type="search" placeholder="Keresés" size="20" />
                    <button type="button" class="btn btn-primary emmet-search-simple"><span class="oi oi-magnifying-glass"></span></button>
                    <button type="button" class="btn btn-secondary emmet-search-advanced"><span class="oi oi-cog"></span></button>
                </div>
            </form>
            <div class="mt-3"><a href="#" class="emmet-p-main-proj-btn btn btn-primary emmet-form-block" role="button">Vetítés</a></div>
            <hr />
            <div id="emmet-change-notification" class="d-none">
                <div class="emmet-main-latest-changes alert alert-dismissible alert-primary">
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    <h5 class="alert-heading">Az Emmet frissült a legutóbbi látogatásod óta</h5>
                    <div id="emmet-change-notification-content"></div>
                </div>
            </div>
            <h5>Legutóbbi változások</h5>
            <div class="container-fluid mt-4">
                <div class="row">
                    <div class="col-6 col-md-4 offset-md-2">
                        <p>
                            <span class="oi oi-cog"></span><br>
                            <strong>Program</strong><br>
                            <span id="emmet-software-version">
                                <span class="spinner-border spinner-border-sm">
                                    <span class="visually-hidden">Betöltés...</span>
                                </span>
                            </span>
                        </p>
                        <p class="text-center">
                            <button type="button" class="btn btn-primary emmet-collapser-btn collapsed" data-bs-toggle="collapse" data-bs-target="#emmet-latest-changes">Változások</button>
                        </p>
                    </div>
                    <div class="col-6 col-md-4">
                        <p><span class="oi oi-musical-note"></span><br><strong>Dalok</strong><br><?php print(date("Y.m.d.", filemtime("songs.json"))); ?></p>
                        <p class="text-center">
                            <a href="https://github.com/emmanuelkozosseg/edra/releases" class="btn btn-primary" role="button" target="_blank">Változások <small><span class="oi oi-external-link ps-1"></span></small></a>
                        </p>
                    </div>
                </div>
            </div>
            <div id="emmet-latest-changes" class="alert alert-secondary emmet-main-latest-changes collapse">
                <div class="text-center">
                    <div class="spinner-border spinner-border-sm">
                        <span class="visually-hidden">Betöltés...</span>
                    </div>
                </div>
            </div>
            <hr />
            <h5>Emmet Offline</h5>
            <p>A <em>Jézus él!</em> énekeskönyv összes dala egy, az Emmet megjelenésére hasonlító PDF-ben,<br />
                tartalomjegyzékkel és a navigálást megkönnyítő hivatkozásokkal.</p>
            <p><a href="https://github.com/emmanuelkozosseg/edra/releases/latest/download/emmet_offline.pdf" class="btn btn-primary" role="button">Letöltés</a></p>
            <p class="text-muted small"><strong>Figyelem:</strong> az Android alapértelmezett PDF-olvasója nem tudja kezelni a hivatkozásokat, ezért a tartalomjegyzék nem működik. Ha Androidon szeretnéd használni a letölthető változatot, azt ajánljuk, hogy telepíts egy másik PDF-olvasót, például az <a href="https://play.google.com/store/apps/details?id=com.adobe.reader&hl=hu">Adobe Acrobat Readert</a>.</p>
            <hr />
        </div>
    </div>
    
    <div id="emmet-p-toc" class="emmet-page"></div>
    
    <div id="emmet-p-search" class="emmet-page"></div>

    <div id="emmet-p-help" class="emmet-page">
        <nav>
            <ol class="breadcrumb border border-secondary bg-transparent">
                <li class="breadcrumb-item"><a href="#" class="emmet-home-link">Nyitólap</a></li>
                <li class="breadcrumb-item active">Súgó</li>
            </ol>
        </nav>
        <h4>Mi az Emmet?</h4>
        <p>Az Emmet az <em><strong>Emm</strong>ánuel <strong>É</strong>nek<strong>t</strong>ár</em> rövidítése; egy olyan, mobilon és számítógépen is használható weboldal, amely az Emmánuel Közösség által ismert énekeket tartalmazza.</p>
        <h4>Hogyan használjam?</h4>
        <ul>
            <li>
                Az Emmetben minden ének egy vagy több <strong>énekeskönyvbe</strong> tartozik. Mindig <em>nyitva van</em> valamelyik énekeskönyv, ilyenkor az Emmet a benne szereplő énekekre "fókuszál", csak azokat látja.
                <ul>
                    <li>Az éppen nyitott énekeskönyv címét a fejlécben, vastag betűkkel, a könyv ikon mellett találod.</li>
                    <li>A könyvben szereplő énekeket a könyv menüjét legördítve, a <strong>Tartalomjegyzék</strong> oldalon éred el.</li>
                </ul>
            </li>
            <li>Az <strong>Énekszám</strong> mezőben meg tudsz nyitni egy éneket a nyitott énekeskönyvből a száma szerint.</li>
            <li>
                A <strong>Keresés</strong> mezőben a nyitott énekeskönyv dalainak a szövegeiben tudsz keresni.
                <ul>
                    <li>A fogaskerék gombra kattintva az összes ének között, csak a megadott nyelveken, vagy részszavakra is lehet keresni.</li>
                </ul>
            </li>
        </ul>
        <h4>Technikai részletek</h4>
        <ul>
            <li>Az énekeket egy Emmet.yaml nevű formátumban tároljuk az Edrában (Emmánuel Dalraktár), <a href="https://github.com/emmanuelkozosseg/edra">a GitHubon</a>. További információkat az énekek vetítéséről és az Emmet.yaml formátumról ott találsz.</li>
            <li>Az Emmet nyílt forráskódú, a Git repót szintén <a href="https://github.com/emmanuelkozosseg/emmet">a GitHubon</a> találod meg. Ha szeretnél segíteni, szívesen fogadjuk; kérlek, kövesd a normál Gites menetrendet (forkold le a repót, végezd el a módosításokat, majd küldj pull requestet).</li>
        </ul>
    </div>
</main>
