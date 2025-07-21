(function() {
    var sriConfig = {
        jquery: 'sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g==',
        bootstrap: 'sha384-ndDqU0Gzau9qJ1lfW4pNLlhNTkCfHzAVBReH9diLvGRem5+R9g2FzA8ZGN954O5Q',
        mustache: 'sha512-HYiNpwSxYuji84SQbCU5m9kHEsRqwWypXgJMBtbRSumlx1iBB6QaxgEBZHSHEGM+fKyCX/3Kb5V5jeVXm0OglQ==',
        jscookie: 'sha512-nlp9/l96/EpjYBx7EP7pGASVXNe80hGhYAUrjeXnu/fyF5Py0/RXav4BBNs7n5Hx1WFhOEOWSAVjGeC3oKxDVQ==',
    };
    require.config({
        paths: {
            jquery: [
                'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min',
                'lib/jquery.3.7.1.min'
            ],
            bootstrap: [
                'https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min',
                'lib/bootstrap.bundle.5.3.7.min'
            ],
            mustache: [
                // 4.2.0 isn't compatible with require.js
                'https://cdnjs.cloudflare.com/ajax/libs/mustache.js/4.1.0/mustache.min',
                'lib/mustache.4.1.0.min'
            ],
            jscookie: [
                'https://cdnjs.cloudflare.com/ajax/libs/js-cookie/3.0.5/js.cookie.min',
                'lib/js.cookie.3.0.5.min'
            ],
        },
        onNodeCreated: function(node, config, module, path) {
            if (path.startsWith("lib/") || ! (module in sriConfig)) {
                return;
            }
            node.setAttribute('integrity', sriConfig[module]);
            node.setAttribute('crossorigin', 'anonymous');
        },
        waitSeconds: 20,
    });
})();

(function() {
    // Add busts to JS URLs (if available)
    var load = requirejs.load;
    requirejs.load = function (context, moduleId, url) {
        if (url in emmet_busts) {
            url = url.replace(".js", "."+emmet_busts[url]+".js");
        }
        return load(context, moduleId, url);
    };
}());

require(['jquery', 'bootstrap', 'mustache', 'emmet/main', 'emmet/notifier'],
function(j, b, m, emmetMain, emmetNotifier) {
    // All code is loaded.
    
    // Replace pre-load error watcher with the nicer one
    window.removeEventListener("error", emmetPreLoadErrorHandler);
    window.addEventListener("error", function(e) {
        emmetNotifier.showProgramError(e.message, e.filename, e.lineno, e.colno);
    });

    // Bootstrap fix for stacked modals
    $(document).on('show.bs.modal', '.modal', function () {
        var zIndex = 1040 + (10 * $('.modal:visible').length);
        $(this).css('z-index', zIndex);
        setTimeout(function() {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);
    });
    $(document).on('hidden.bs.modal', '.modal', function () {
        $('.modal:visible').length && $(document.body).addClass('modal-open');
    });
    
    // Start to initialize
    emmetMain.init();
});
