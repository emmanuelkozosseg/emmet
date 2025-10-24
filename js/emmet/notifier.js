define(['bootstrap', 'jquery'], function(bootstrap, _j) {
    var setContents = function(id, title, message) {
        $("#emmet-"+id+"-modal .modal-title").text(title);
        $("#emmet-"+id+"-modal .modal-body").html(message);
    };
    
    var showError = function(title, message) {
        setContents("error", title, message);
        new bootstrap.Modal("#emmet-error-modal").show();
    };
    
    return {
        showError: showError,
        
        showProgramError: function(errorMsg, url, lineNumber, columnNumber) {
            showError("Programhiba",
                    "<p>Az Emmet programhibát észlelt. Érdemes újratölteni az oldalt, mivel a működése instabillá válhat.</p>"+
                    "<p><small>Ha szeretnél segíteni a javításban, kérünk, <a href=\"https://github.com/emmanuelkozosseg/emmet/issues\" target=\"_blank\">jelentsd be a hibát</a> " +
                    "a lenti részletekkel együtt, és hogy mit csináltál, mielőtt a hiba előjött volna. <strong>Köszönjük! :)</strong></small></p>"+
                    "<p><code>Error: "+errorMsg+"<br />URL: "+url+"<br />"+
                    "Line number: "+lineNumber+"<br />"+
                    "Column number: " + (columnNumber !== undefined ? columnNumber : "(unsupported by the browser)") + "<br />" +
                    "User agent: "+navigator.userAgent+
                    "</code></p>"+
                    "<p><small>További részletek (pl. stacktrace) a böngésző fejlesztői konzolján érhetőek el.</small></p>"
            );
        },
        
        showSongLoadingError: function(errorDetails) {
            setContents("fatal", "Énekbetöltési hiba",
                    "<p>Az Emmet nem tudja betölteni az énekeket, ezért sajnos nem működőképes. :(</p>"+
                    "<p><small>Ha szeretnél segíteni a javításban, kérünk, <a href=\"https://github.com/emmanuelkozosseg/emmet/issues\" target=\"_blank\">jelentsd be a hibát</a> " +
                    "a lenti részletekkel együtt. <strong>Köszönjük! :)</strong></small></p>"+
                    "<p><code>"+errorDetails.replace(/\n/g, "<br />")+"</code></p>"+
                    "<p><small>Lehet, hogy további részletek olvashatók a hibáról a böngésző fejlesztői konzolján.</small></p>"
            );
            new bootstrap.Modal("#emmet-fatal-modal", {
                    backdrop: 'static',
                    keyboard: false,
            }).show();
        },
    };
});
