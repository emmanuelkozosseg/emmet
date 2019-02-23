require.config({
    paths: {
        jquery: 'lib/jquery.3.3.1.min',
        bootstrap: 'lib/bootstrap.bundle.4.1.3.min',
        mustache: 'lib/mustache.3.0.1.min',
        audioplayer: 'lib/jquery.audioplayer.min'
    },
    onNodeCreated: function(node, config, module, path) {
        var sri = {
            jquery: 'sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=',
            bootstrap: 'sha256-E/V4cWE4qvAeO5MOhjtGtqDzPndRO1LBk8lJ/PR7CA4=',
            mustache: 'sha256-srhz/t0GOrmVGZryG24MVDyFDYZpvUH2+dnJ8FbpGi0=',
        };
        if (sri[module]) {
            node.setAttribute('integrity', sri[module]);
            node.setAttribute('crossorigin', 'anonymous');
        }
    },
    urlArgs: function(id, url) {
        if (url in emmet_busts) {
            return (url.indexOf('?') === -1 ? '?' : '&') + "bust=" + emmet_busts[url];
        }
        return "";
    },
    shim: {
        audioplayer: {
            deps: ['jquery'],
        },
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
