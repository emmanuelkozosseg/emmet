require.config({
    paths: {
        jquery: 'lib/jquery.3.3.1.min',
        bootstrap: 'lib/bootstrap.bundle.4.4.1.min',
        mustache: 'lib/mustache.3.0.1.min',
    },
    urlArgs: function(id, url) {
        if (url in emmet_busts) {
            return (url.indexOf('?') === -1 ? '?' : '&') + "bust=" + emmet_busts[url];
        }
        return "";
    },
});

require(['jquery', 'bootstrap', 'mustache', 'emmet/main', 'emmet/notifier'],
function(j, b, m, emmetMain, emmetNotifier) {
    // All code is loaded.
    
    // Add error watcher
    window.onerror = function(errorMsg, url, lineNumber) {
        emmetNotifier.showProgramError(errorMsg, url, lineNumber);
        return false;
    };
    
    // Start to initialize
    emmetMain.init();
});
