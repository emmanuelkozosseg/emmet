define(['emmet/notifier', 'emmet/songdata', 'emmet/utils', 'emmet/search', 'mustache'],
function(emmetNotifier, emmetSongData, emmetUtils, emmetSearch, mustache) {
    return {
        displayAdvancedSearch: function(keyword) {
            var langsForDisplay = emmetSongData.getAvailableLanguages()
                    .map(l => {return {lang: l, country: emmetUtils.getCountryOfLang(l)}});
            
            var modalHtml = mustache.to_html(emmetUtils.getTemplate("advsearchform"), {
                'languages': langsForDisplay,
                'keyword': keyword,
            });
            $("#emmet-search-modal .modal-content").html(modalHtml);

            // Set up search mode selector
            $('input:radio[name="emmet-advs-mode"]').change(function() {
                if (! this.checked) {return;}

                // Enable / disable language list
                $("input.emmet-advs-lang").attr("disabled", this.value != "full");
                $("button.emmet-advs-lang-selectbtn").attr("disabled", this.value != "full");

                // Change highlighted panel
                $("li.emmet-advs-mode-selector").removeClass("emmet-active");
                $(this).parents("li.emmet-advs-mode-selector").addClass("emmet-active");
            });
            $("#emmet-search-modal .emmet-advs-mode-list ul > li > div").click(function(e) {
                if ($(e.target).is("div.emmet-advs-lang-selector")
                        || $(e.target).parents("div.emmet-advs-lang-selector").length != 0) {
                    return;
                }
                $('input:radio[name="emmet-advs-mode"]').removeAttr("checked");
                $(this).parents("li.emmet-advs-mode-selector").find("input.emmet-advs-mode-radio")
                        .prop("checked", true)
                        .change();
            });

            // Set up "select all / none" links
            $("#emmet-advs-lang-selectall").click(function() {
                $("input.emmet-advs-lang").prop("checked", true);
            });
            $("#emmet-advs-lang-selectnone").click(function() {
                $("input.emmet-advs-lang").prop("checked", false);
            });

            // Set up search trigger
            $("#emmet-advs-form").submit(function(e) {
                e.preventDefault();
                var searchExpression = $("#emmet-advs-expr").val();
                var searchMode = $("input[name=emmet-advs-mode]:checked").val();
                var wordMatching = $("input[name=emmet-advs-wordm]:checked").val();
                var languages = $("input.emmet-advs-lang:checked").map(function() {return $(this).val();}).get();

                if (searchMode == "full" && languages.length == 0) {
                    emmetNotifier.showError("Válassz nyelvet", "Kérünk, válassz ki legalább egy nyelvet a teljes kereséshez!");
                    return;
                }

                emmetSearch.search(searchExpression, searchMode, wordMatching, languages);
            });

            $("#emmet-search-modal").modal();
        },
    };
});