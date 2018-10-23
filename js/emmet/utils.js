define([], function() {
    return {
        isChorus: function(verseCode) {
            return verseCode.substring(0, 1) == "c";
        },
        isBridge: function(verseCode) {
            return verseCode.substring(0, 1) == "b";
        },
        getTemplate: function(templateId) {
            return $("#emmet-tmpl-"+templateId).html();
        },
        showPage: function(pageId) {
            $("main").children().hide();
            $("#emmet-p-"+pageId).show();
        },
    };
});