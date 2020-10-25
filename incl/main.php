<main class="p-3">
    <div id="emmet-p-main" class="emmet-page">
        <div class="emmet-logo"><div>
            <img src="img/logo.png" alt="Emmet" />
            <span>Emmánuel Énektár</span>
        </div></div>

        <div class="emmet-main-forms">
            <hr />
            <a href="#" class="emmet-p-main-toc-btn btn btn-primary emmet-form-block" role="button" aria-label="Megnyitás">Tartalomjegyzék</a>
            <h5>Ének megnyitása</h5>
            <form class="form-inline emmet-form-block emmet-form-jumpto">
                <div class="input-group">
                    <input class="form-control emmet-jumpto-songno" type="search" placeholder="Énekszám" aria-label="Énekszám" size="8" />
                    <div class="input-group-append">
                        <button class="btn btn-primary" type="submit"><span class="oi oi-share"></span></button>
                    </div>
                </div>
            </form>
            <h5>Keresés</h5>
            <form class="form-inline emmet-form-block emmet-form-search">
                <div class="input-group">
                    <input class="form-control emmet-search-expr" type="search" placeholder="Keresés" aria-label="Keresés" size="20" />
                    <div class="input-group-append" role="group" aria-label="Keresés">
                        <button type="button" class="btn btn-primary emmet-search-simple"><span class="oi oi-magnifying-glass"></span></button>
                        <button type="button" class="btn btn-secondary emmet-search-advanced"><span class="oi oi-cog"></span></button>
                    </div>
                </div>
            </form>
            <hr />
            <h5>Legutóbbi változások</h5>
            <p>Az Emmetet legutóbb <strong>2020.10.25-én</strong> frissítettük.</p>
            <p class="text-center">
                <button type="button" class="btn btn-primary" data-toggle="collapse" data-target="#emmet-latest-changes" aria-expanded="false" aria-controls="emmet-latest-changes">Mi változott?</button>
            </p>
            <div id="emmet-latest-changes" class="alert alert-secondary emmet-main-latest-changes collapse">
                <?php require(__DIR__."/main-latest-changes.html"); ?>
            </div>
            <hr />
            <h5>Emmet Offline</h5>
            <p>A <em>Jézus él!</em> énekeskönyv összes dala egy, az Emmet megjelenésére hasonlító PDF-ben,<br />
                tartalomjegyzékkel és a navigálást megkönnyítő hivatkozásokkal.</p>
            <p><a href="https://bitbucket.org/eckerg/emmert/downloads/emmet_offline.pdf" class="btn btn-primary" role="button">Letöltés</a></p>
            <p class="text-muted small"><strong>Figyelem:</strong> az Android alapértelmezett PDF-olvasója nem tudja kezelni a hivatkozásokat, ezért a tartalomjegyzék nem működik. Ha Androidon szeretnéd használni a letölthető változatot, azt ajánljuk, hogy telepíts egy másik PDF-olvasót, például az <a href="https://play.google.com/store/apps/details?id=com.adobe.reader&hl=hu">Adobe Acrobat Readert</a>.</p>
        </div>
    </div>
    
    <div id="emmet-p-toc" class="emmet-page"></div>
    
    <div id="emmet-p-search" class="emmet-page"></div>

    <div id="emmet-p-help" class="emmet-page">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb border border-secondary bg-transparent">
                <li class="breadcrumb-item"><a href="#" class="emmet-home-link">Nyitólap</a></li>
                <li class="breadcrumb-item active" aria-current="page">Súgó</li>
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
            <li>Az énekeket egy Emmet.yaml nevű formátumban tároljuk <a href="https://bitbucket.org/eckerg/emmet-enekek">a Bitbucketen</a>. További információkat az énekek vetítéséről és az Emmet.yaml formátumról ott találsz.</li>
            <li>Az Emmet nyílt forráskódú, a Git repót szintén <a href="https://bitbucket.org/eckerg/emmet">a Bitbucketen</a> találod meg. Ha szeretnél segíteni, szívesen fogadjuk; kérlek, kövesd a normál Gites menetrendet (forkold le a repót, végezd el a módosításokat, majd küldj pull requestet).</li>
        </ul>
    </div>
</main>