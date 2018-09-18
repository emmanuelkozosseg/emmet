define([], function() {
    return {
        isChorus: function(verseCode) {
            return verseCode.substring(0, 1) == "C";
        },
        isBridge: function(verseCode) {
            return verseCode.substring(0, 1) == "B";
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