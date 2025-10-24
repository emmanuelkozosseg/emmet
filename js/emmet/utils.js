define(['jquery'], function(_j) {
    var langsWithDifferentCountryCodes = {
        'la': 'va',
        'en': 'gb'
    };
    var collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
    var ensemblePurpose = {
        'order': 1,
        'icon': 'oi-people',
        'name': 'Stúdiófelvétel',
        'desc': 'Többszólamú, hangszeres felvétel'
    };
    var soloGuitarPurpose = {
        'order': 2,
        'icon': 'oi-person',
        'name': 'Gitáros felvétel',
        'desc': 'Szóló felvétel gitárkísérettel'
    };
    var unknownRecordPurpose = {
        'order': 999,
        'icon': 'oi-question-mark',
        'name': 'Ismeretlen',
        'desc': 'Ismeretlen célú felvétel',
    };
    var recordPurposes = {
        'listening': ensemblePurpose,
        'ensemble': ensemblePurpose,
        'solo-guitar': soloGuitarPurpose,
        'aid': soloGuitarPurpose,
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