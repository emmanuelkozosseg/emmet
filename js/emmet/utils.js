define([], function() {
    var langsWithDifferentCountryCodes = {'la': 'va', 'en': 'gb'};
    var collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});

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
        getCountryOfLang: function(lang) {
            if (lang in langsWithDifferentCountryCodes) {
                return langsWithDifferentCountryCodes[lang];
            }
            return lang;
        },
        showPage: function(pageId) {
            $("main").children().hide();
            $("#emmet-p-"+pageId).show();
        },
        getCollator: function() {
            return collator;
        }
    };
});