function addButtons(div, cm) {
    var header = div.children[0];
    /*var copy = document.createElement("div");
    copy.classList.add("codeblockbutton");
    header.appendChild(copy);
    copy.innerHTML = "Copy All Code"
    copy.onclick = function() {
        //TODO implement copy
    }*/
    if (div.attributes.getNamedItem("data-showme-hide-button").value === "0") {
        var showing = true;
        if (div.attributes.getNamedItem("data-showme-hide-code").value === "1") {
            cm.getWrapperElement().style.display = "none";
            showing = false;
        }
        var hide = document.createElement("div");
        hide.classList.add("codeblockbutton");
        hide.style.marginLeft = "0.5em";
        header.appendChild(hide);
        if (showing)
            hide.innerHTML = "Hide";
        else
            hide.innerHTML = "Show";
        hide.onclick = function() {
            if (showing) {
                cm.getWrapperElement().style.display = "none";
                hide.innerHTML = "Show";
            } else {
                cm.getWrapperElement().style.display = "inherit";
                hide.innerHTML = "Hide";
            }
            showing = !showing;
        }
    }
}

window.onload = function() {
    var codeblocks = document.getElementsByClassName("code");
    for (i = 0; i < codeblocks.length; i++) { 
        var codeblock = codeblocks[i].children[1];
        var firstLineNumber = codeblocks[i].getAttribute("data-firstline");
        var lineNumberFormatter = function(line) { return String(line); };
        if (firstLineNumber == null)
            firstLineNumber = 1;
        else if (firstLineNumber == 0)
            lineNumberFormatter = function(line) { return ""; };

        // Split into lines and delete last line if it is blank.
        //
        // Rationale: There is sometimes, but not always, an extra newline at
        // the end.
        var lines = codeblock.value.split('\n');
        if (lines[lines.length-1] == '')
            lines.splice(-1,1);
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
        addButtons(codeblocks[i], cm);
    }
}