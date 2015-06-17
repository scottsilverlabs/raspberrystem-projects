window.onload = function() {
    var codeblocks = document.getElementsByClassName("code");
    for (i = 0; i < codeblocks.length; i++) { 
        codeblock = codeblocks[i].children[1]
        firstline = codeblocks[i].getAttribute("data-firstline")
        if (! firstline) {
            firstline = 1
        }

        // Split into lines and delete first and last lines.  Then rejoin.
        // Rationale: its easier to keep the code blocks in the HTML when the
        // top and bottom lines are stripped.
        var lines = codeblock.innerHTML.split('\n');
        lines.splice(0,1);
        lines.splice(-1,1);
        var newtext = lines.join('\n');

        // fromTextArea uses the "value" of the element, not the innerHTML content.
        codeblock.value = newtext

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
    }
}
