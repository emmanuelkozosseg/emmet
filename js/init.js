var emmet = new Object;

emmet.init = (function() {
    var initFunctions = [];
    
    var addErrorHandler = function() {
        window.onerror = function(errorMsg, url, lineNumber) {
            emmet.notifier.showError("Programhiba",
                    "<p>Az Emmet programhibát észlelt. Érdemes újratölteni az oldalt, mivel a működése instabillá válhat.</p>"+
                    "<p><small>Ha szeretnél segíteni a javításban, kérünk, küldd el az ecker [pont] gabor [kukac] gmail [pont] com címre " +
                    "a lenti részleteket, és hogy mit csináltál, mielőtt a hiba előjött volna. <strong>Köszönjük! :)</strong></small></p>"+
                    "<p><code>Error: "+errorMsg+"<br />URL: "+url+"<br />Line number: "+lineNumber+"</code></p>"+
                    "<p><small>A stacktrace és további részletek a böngésző fejlesztői konzolján érhetőek el.</small></p>"
            );
            return false;
        };
    };
    
    return {
        addErrorHandler: addErrorHandler,
    };
})();

$(function() {
    LazyLoad.js([
        // Libraries
        "js/lib/mustache.min.js",
        "js/lib/naturalsort.js",
        // Components
        "js/emmet/loader.js",
        "js/emmet/main.js",
        "js/emmet/notifier.js",
        "js/emmet/search.js",
        "js/emmet/songdisplay.js",
        "js/emmet/toc.js",
    ], function() {
        // Everything is loaded, run init
        emmet.init.addErrorHandler();
        emmet.main.init();
    })
});
