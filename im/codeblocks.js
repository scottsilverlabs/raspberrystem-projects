window.onload = function() {
    var codeblocks = document.getElementsByClassName("code");
    for (i = 0; i < codeblocks.length; i++) { 
        codeblock = codeblocks[i].children[1];
        firstline = codeblocks[i].getAttribute("data-firstline");
        if (! firstline) {
            firstline = 1;
        }

        // Split into lines and delete last line.  Then rejoin.
        // Rationale: its easier to keep the code blocks in the HTML when the
        // top and bottom lines are stripped.
        var lines = codeblock.value.split('\n');
        lines.splice(-1,1);
        numLines = lines.length;
        codeblock.value = lines.join('\n');

        var cm = CodeMirror.fromTextArea(codeblock, {
            mode: {
                name: "python",
                version: 3,
                singleLineStringErrors: false
            },
            firstLineNumber: Number(firstline),
            lineNumbers: true,
            theme: "solarized-dark",
            readOnly: true,
            textWrapping: true,
        });

        cm.setSize(null, cm.defaultTextHeight() * (numLines+1));
    }
}
