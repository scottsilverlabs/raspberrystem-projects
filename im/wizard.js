chainedOnload(function() {
    var wizards = document.getElementsByClassName("wizard");

    /*
     * Add QUIT/NEXT buttons to all wizards
     */
    for (i = 0; i < wizards.length; i++) {
        var wrapper = document.createElement("div");

        if (i < wizards.length - 1) {
            quit = document.createElement("button");
            quit.id = "quit";
            quit.onclick = quit_wizard;
            quit.innerHTML = "QUIT";
            wrapper.appendChild(quit);
        }

        next = document.createElement("button");
        next.id = "next";
        next.onclick = next_wizard;
        next.innerHTML = i < wizards.length - 1 ? "NEXT" : "FINISH";
        wrapper.appendChild(next);

        wizards[i].firstElementChild.appendChild(wrapper);
    }
});

function onresize() {
    /*
     * Wizard locations won't be correct when window is resized.  As such, just
     * quit the qizard on the rare instance of a resize while it is running.
     */
    quit_wizard();
}

function wizard() {
    /*
     * Guarantee a previous wizard is not running.
     */
    quit_wizard();

    /*
     * Parent document needs our wizard's CSS.  Note: this link has path
     * different from the link included in the HTML.
     */
    css_paths = ['projects/wizard.css', 'wizard.css'];
    css_links = [];
    for (i = 0; i < css_paths.length; i++) {
        css_link = document.createElement('link');
        css_link.type = 'text/css';
        css_link.rel = 'stylesheet';
        css_link.href = css_paths[i];
        parent.document.head.appendChild(css_link);
        css_links.push(css_link);
    }

    /*
     * Determine the width/height of an arrow.  Needed later to computer position.  
     *
     * Seems goofy to have to do it this way, but I see no easy alternative:
     * add off-screen wizard arrow element, get computed width/height, and then
     * remove it.
     */
    /*
     * Argh - sometimes this fails (Chrome on Mac).  Forcing fixed arrow width
     *
    var w = document.createElement("div");
    w.classList.add("wizard");
    w.style.position = "fixed";
    w.style.top = "-999px";
    w.style.left = "-999px";
    w.style.display = "block";
    var a = document.createElement("div");
    a.classList.add("arrow");
    a.classList.add("left");
    a.style.display = "block";
    w.appendChild(a);
    parent.document.body.appendChild(w);
    arrow_width = a.offsetWidth;
    arrow_height = a.offsetHeight;
    w.parentNode.removeChild(w);
     */
    arrow_width = 32;
    arrow_height = 32;

    /*
     * Clone the wizards.
     *
     * When cloning wizards from iframe to it's parent, the onclick event
     * handler (or all handlers really) isn't cloned  by cloneNode() (should it
     * be?).  So we manually clone it for all buttons.
     */
    var wizard_wrapper = document.getElementById("wizard_wrapper");
    cloned_wizard_wrapper = wizard_wrapper.cloneNode(true);
    var buttons = wizard_wrapper.getElementsByTagName('button');
    var cloned_buttons = cloned_wizard_wrapper.getElementsByTagName('button');
    for (i = 0; i < buttons.length; i++) {
        cloned_buttons[i].onclick = buttons[i].onclick;
    }

    /*
     * For each cloned wizard, adjust its position given the user attributes
     * that specify what element its relative to, and which side of that
     * element.
     */
    cloned_wizards = cloned_wizard_wrapper.getElementsByClassName("wizard");
    for (i = 0; i < cloned_wizards.length; i++) {
        /*
         * Clone and adjust wizard blocks
         */
        var block = cloned_wizards[i].getElementsByClassName("block")[0];
        var ref = block.getAttribute("data-ref");
        ref = ref ? ref.split(/\s+/) : [];
        var ref_id = ref.length > 0 ? ref[0] : "ide";
        var ref_side = ref.length > 1 ? ref[1] : "bottom";
        var xoff = ref.length > 2 ? parseInt(ref[2]) : 0;
        var yoff = ref.length > 3 ? parseInt(ref[3]) : 0;

        var ref_node = parent.document.getElementById(ref_id);
        var ref_node_offset = getOffset(ref_node);
        var wizard_top = 0;
        var wizard_left = 0;
        if (ref_side == "left") {
            wizard_top = ref_node_offset.top + ref_node.offsetHeight/2;
            wizard_left = ref_node_offset.left;
        } else if (ref_side == "right") {
            wizard_top = ref_node_offset.top + ref_node.offsetHeight/2;
            wizard_left = ref_node_offset.left + ref_node.offsetWidth;
        } else if (ref_side == "top") {
            wizard_top = ref_node_offset.top;
            wizard_left = ref_node_offset.left + ref_node.offsetWidth/2;
        } else if (ref_side == "bottom") {
            wizard_top = ref_node_offset.top + ref_node.offsetHeight;
            wizard_left = ref_node_offset.left + ref_node.offsetWidth/2;
        } else if (ref_side == "topleft") {
            wizard_top = ref_node_offset.top;
            wizard_left = ref_node_offset.left;
        } else if (ref_side == "bottomleft") {
            wizard_top = ref_node_offset.top + ref_node.offsetHeight;
            wizard_left = ref_node_offset.left;
        }
        cloned_wizards[i].style.top = (wizard_top + yoff) + "px";
        cloned_wizards[i].style.left = (wizard_left + xoff) + "px";

        /*
         * Clone and adjust wizard arrows
         * 
         * arrow_side supports only left/top
         */
        var arrow = cloned_wizards[i].getElementsByClassName("arrow")[0];
        var ref = arrow.getAttribute("data-ref");
        ref = ref ? ref.split(/\s+/) : [];
        var arrow_side = ref.length > 0 ? ref[0] : "left";
        var offset = ref.length > 1 ? parseInt(ref[1]) : 0;
        var ref_id = ref.length > 2 ? ref[2] : null;

        var top = 0;
        var left = 0;
        if (ref_id) {
            var ref_node = parent.document.getElementById(ref_id);
            var ref_node_offset = getOffset(ref_node);
            var ref_node_center_x = ref_node_offset.left + ref_node.offsetWidth/2;
            var ref_node_center_y = ref_node_offset.top + ref_node.offsetHeight/2;

            if (arrow_side == "left") {
                offset += ref_node_center_y - wizard_top - arrow_height/2;
            } else if (arrow_side == "top") {
                offset += ref_node_center_x - wizard_left - arrow_width/2;
            }
        }
        if (arrow_side == "left") {
            top += offset;
            left += -arrow_width;
        } else if (arrow_side == "top") {
            top += -arrow_height;
            left += offset;
        }
        arrow.style.top = top  + "px";
        arrow.style.left = left + "px";
    }

    editor = parent.document.getElementsByClassName("CodeMirror")[0].CodeMirror;

    /*
     * Handle button keycodes (NEXT/ENTER, QUIT/ESC)
     */
    parent_saved_onkeyup = parent.document.body.onkeyup;
    parent.document.body.onkeyup = function(e) {
        var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
        if (e.keyCode == 13) {
            next_wizard();
        } else if (e.keyCode == 27) {
            quit_wizard();
        }
    };

    /*
     * Add the wizard wrapper to the IDE.
     *
     * To start, all wizards are off (display: none), except the first.
     */
    cloned_wizard_wrapper.style.display = "none";
    for (i = 0; i < cloned_wizards.length; i++) {
        cloned_wizards[i].style.display = "none";
    }
    parent.document.body.appendChild(cloned_wizard_wrapper);
    current_wizard = 0;
    cloned_wizards[current_wizard].style.display = "block";

    /*
     * Turn off codemirror, so it doesn't flash cursor or try to handle
     * keypresses.
     */
    editor.setOption("readOnly", "nocursor")

    /*
     * Display it & set focus()
     *
     * We display it from a timer because we otherwise get an "flashing"
     * artifact where you can see the div before the CSS has been applied.
     *
     * Also, we focus the wizard wrapper, so all keypresses go through it.
     * tabIndex must be set for focus(0 to work on a div.  Also, setting focus
     * directly can cause the button blur to fire after focus - a workaround is
     * to delay from a timer.
     */
    setTimeout(function(){ 
        cloned_wizard_wrapper.style.display = "block";
        cloned_wizard_wrapper.tabIndex = -1;
        cloned_wizard_wrapper.focus();
        }, 0);

};

function next_wizard() {
    cloned_wizards[current_wizard].style.display = "none";
    current_wizard += 1;
    if (current_wizard < cloned_wizards.length) {
        cloned_wizards[current_wizard].style.display = "block";
    } else {
        quit_wizard();
    }
}
parent.next_wizard = next_wizard;

function quit_wizard() {
    if (typeof parent_saved_onkeyup != "undefined") {
        parent.document.body.onkeyup = parent_saved_onkeyup;
        delete parent_saved_onkeyup;
    }
    if (typeof cloned_wizard_wrapper != "undefined") {
        cloned_wizard_wrapper.parentNode.removeChild(cloned_wizard_wrapper);
        delete cloned_wizard_wrapper;
    }
    if (typeof css_links != "undefined") {
        for (i = 0; i < css_paths.length; i++) {
            css_links[i].parentNode.removeChild(css_links[i]);
        }
        delete css_links;
    }
    if (typeof editor != "undefined") {
        editor.setOption("readOnly", false);
    }
}
parent.quit_wizard = quit_wizard;

function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

