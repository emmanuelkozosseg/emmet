require.config({
    paths: {
        jquery: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min',
        bootstrap: 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/js/bootstrap.bundle.min',
        mustache: 'https://cdnjs.cloudflare.com/ajax/libs/mustache.js/3.0.0/mustache.min',
        naturalsort: 'lib/naturalsort',
    },
    onNodeCreated: function(node, config, module, path) {
        var sri = {
            jquery: 'sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=',
            bootstrap: 'sha256-E/V4cWE4qvAeO5MOhjtGtqDzPndRO1LBk8lJ/PR7CA4=',
            mustache: 'sha256-1B6REXjRTNQ4IJEUSVYbAqEDRIYP8uKNUo+QgYZUzJM=',
        };
        if (sri[module]) {
            node.setAttribute('integrity', sri[module]);
            node.setAttribute('crossorigin', 'anonymous');
        }
    },
    urlArgs: function(id, url) {
        if (url in emmet_busts) {
            //console.log("Bust found: "+url+" => "+emmet_busts[url]);
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
