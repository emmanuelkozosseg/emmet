var emmet = new Object;

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
        // All code is loaded.
        
        // Add error watcher
        window.onerror = function(errorMsg, url, lineNumber) {
            emmet.notifier.showProgramError(errorMsg, url, lineNumber);
            return false;
        };
        
        // Start to initialize
        emmet.main.init();
    })
});
