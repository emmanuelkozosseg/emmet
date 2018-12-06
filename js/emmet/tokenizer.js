define([], function() {
    var tokenize = function(str) {
        str = str.toLowerCase();
        // Remove all non-word and non-space characters
        str = str.replace(/[^a-zA-Z0-9\u00C0-\u024F ]/g, "");
        // Reduce duplicate spaces
        str = str.replace(/ {2,}/g, " ");
        // Generalize accented characters
        str = str.replace(/á/g, "a");
        str = str.replace(/é/g, "e");
        str = str.replace(/í/g, "i");
        str = str.replace(/[óöő]/g, "o");
        str = str.replace(/[úüű]/g, "u");
        
        if (str == "") {return null;}
        return str;
    };

    return {
        tokenize: tokenize,
        tokenizeVerseLines: function(lines) {
            var tokenized = [];
            for (var i = 0; i < lines.length; i++) {
                var tokenizedLine = tokenize(lines[i]);
                if (tokenizedLine == null) {
                    continue;
                }
                tokenized.push(tokenizedLine);
            }
            return tokenized.join(" ");
        },
    };
});