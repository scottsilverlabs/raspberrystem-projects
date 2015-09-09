window.onload = function() {
    var codeblocks = document.getElementsByClassName("code");
    for (i = 0; i < codeblocks.length; i++) { 
        codeblock = codeblocks[i].children[1];
        firstLineNumber = codeblocks[i].getAttribute("data-firstline");
        lineNumberFormatter = function (line) {return String(line)};
        if (firstLineNumber == null) {
            firstLineNumber = 1;
        } else if (firstLineNumber == 0) {
            lineNumberFormatter = function (line) {return ""};
        }

        // Split into lines and delete last line if it is blank.
        //
        // Rationale: There is sometimes, but not always, an extra newline at
        // the end.
        var lines = codeblock.value.split('\n');
        if (lines[lines.length-1] == '') {
            lines.splice(-1,1);
        }
        numLines = lines.length;
        codeblock.value = lines.join('\n');

        var cm = CodeMirror.fromTextArea(codeblock, {
            mode: {
                name: "python",
                version: 3,
                singleLineStringErrors: false
            },
            firstLineNumber: Number(firstLineNumber),
            lineNumbers: true,
            lineNumberFormatter: lineNumberFormatter,
            theme: "solarized-dark",
            readOnly: true,
            textWrapping: true,
        });

        // Auto height computation...  CodeMirror seems like it supports
        // auto-height via CSS, but it wasn't working.
        cm.setSize(null, cm.defaultTextHeight() * (numLines+1));
    }
}
