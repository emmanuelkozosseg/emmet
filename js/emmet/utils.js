define([], function() {
    var langsWithDifferentCountryCodes = {
        'la': 'va',
        'en': 'gb'
    };
    var collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
    var recordPurposes = {
        'listening': {
            'order': 1,
            'icon': 'oi-headphones',
            'name': 'Stúdiófelvétel',
            'desc': 'Zenehallgatásra szánt, többszólamú, hangszeres felvétel'
        },
        'aid': {
            'order': 2,
            'icon': 'oi-puzzle-piece',
            'name': 'Segédanyag',
            'desc': 'Dicsőítési vagy szentségimádási segédanyagnak szánt felvétel'
        },
    };
    var unknownRecordPurpose = {
        'order': 999,
        'icon': 'oi-question-mark',
        'name': 'Ismeretlen',
        'desc': 'Ismeretlen célú felvétel',
    };

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
        },
        getRecordPurposeDetails: function(purposeName) {
            if (purposeName in recordPurposes) {
                return recordPurposes[purposeName];
            } else {
                return unknownRecordPurpose;
            }
        }
    };
});