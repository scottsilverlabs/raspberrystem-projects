chainedOnload(function() {
    var codeblocks = document.getElementsByClassName("code");
    for (i = 0; i < codeblocks.length; i++) { 
        var codeblock = codeblocks[i].children[1];
        var firstLineNumber = codeblocks[i].getAttribute("data-firstline");
        var lineNumberFormatter = function (line) {return String(line)};
        var gutters = [];
        if (firstLineNumber == null) {
            firstLineNumber = 1;
        } else if (firstLineNumber == 0) {
            lineNumberFormatter = function (line) {return ""};
        }
        if (firstLineNumber > 0) {
            gutters.push("CodeMirror-linenumbers");
        }

        // Split into lines and delete last line if it is blank.
        //
        // Rationale: There is sometimes, but not always, an extra newline at
        // the end.
        var lineHighlight = [];
        var lines = codeblock.value.split('\n');
        if (lines[lines.length-1] == '') {
            lines.splice(-1,1);
        }

        // Lines marked with '*' are to be highlighted in the gutter with an
        // arrow.  Find all lines to remember them, and remove the asterisk.
        var needHighlightGutter = false;
        for (var j = 0; j < lines.length; j++) {
            highlight = lines[j][0] == "*";
            if (highlight) {
                lines[j] = lines[j].substring(1);
                needHighlightGutter = true;
            }
            lineHighlight.push(highlight);
        }
        if (needHighlightGutter) {
            gutters.unshift("CodeMirror-arrow");
        }

        // Reaasmble codeblock from lines.
        codeblock.value = lines.join('\n');

        var cm = CodeMirror.fromTextArea(codeblock, {
            mode: {
                name: "python",
                version: 3,
                singleLineStringErrors: false
            },
            firstLineNumber: Number(firstLineNumber),
            lineNumbers: firstLineNumber > 0,
            lineNumberFormatter: lineNumberFormatter,
            theme: "solarized-dark",
            readOnly: true,
            textWrapping: true,
            gutters: gutters,
        });
        for (var j = 0; j < lineHighlight.length; j++) {
            if (lineHighlight[j]) {
                cm.setGutterMarker(j, "CodeMirror-arrow", makeMarker());
            }
        }

        function makeMarker() {
          var marker = document.createElement("div");
          marker.className = "CodeMirror-linemarker";
          marker.innerHTML = "&#10148;";
          return marker;
        }

        // Auto height computation...  CodeMirror seems like it supports
        // auto-height via CSS, but it wasn't working.
        // Note: not-workingness is related to HTML 4 DOCTYPE
        cm.setSize(null, cm.defaultTextHeight() * (lines.length+1));
    }
});
