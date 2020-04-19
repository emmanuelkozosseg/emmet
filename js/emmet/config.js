define(['jscookie', 'emmet/utils'], function(jsCookie, emmetUtils) {
    const COOKIE_KEY = "emmet-settings";
    const COOKIE_EXPIRY_DAYS = 365;

    var settings = {};
    var defaults = {};

    var cookieContent = jsCookie.get(COOKIE_KEY);
    if (cookieContent !== undefined) {
        settings = JSON.parse(atob(cookieContent));
    }

    return {
        configureSettings: function(newSettings) {
            for (let [key, value] of Object.entries(newSettings)) {defaults[key] = value;}
        },
        get: function(key) {
            if (key in settings) {
                return settings[key];
            } else if (key in defaults) {
                return defaults[key];
            } else {
                return undefined;
            }
        },
        set: function(key, value) {
            settings[key] = value;
            jsCookie.set(COOKIE_KEY, btoa(JSON.stringify(settings)), {expires: COOKIE_EXPIRY_DAYS});
        },
    };
});