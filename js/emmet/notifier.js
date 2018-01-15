emmet.notifier = (function() {
    var setContents = function(id, title, message) {
        $("#emmet-"+id+"-modal .modal-title").text(title);
        $("#emmet-"+id+"-modal .modal-body").html(message);
    };
    
    return {
        showError: function(title, message) {
            setContents("error", title, message);
            $("#emmet-error-modal").modal();
        },
        
        showFatal: function(title, message) {
            setContents("fatal", title, message);
            $("#emmet-fatal-modal").modal({
                    backdrop: 'static',
                    keyboard: false,
            });
        },
    };
})();
