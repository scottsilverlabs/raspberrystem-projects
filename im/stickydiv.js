chainedOnload(function() {
    scrolling_title = document.getElementsByClassName('sticky')[0];
    sticky_title = scrolling_title.cloneNode(true); // true means clone all childNodes and all event handlers
    sticky_title.style.visibility = 'hidden';
    sticky_title.style.position = 'fixed';
    sticky_title.className += " stuck";
    sticky_title.style.top = 0;
    sticky_title.style.marginTop = '0px';
    sticky_title.style.zIndex += 10000;
    scrolling_title.parentNode.appendChild(sticky_title);

    updateSticky();
    window.addEventListener("scroll", updateSticky);

    resizer();
    window.addEventListener("resize", resizer);
});

function resizer() {
    updateWidth();
    updateSticky();
}

function updateWidth() {
    sticky_title.style.width = window.getComputedStyle(scrolling_title).getPropertyValue('width');
}

function updateSticky() {
    if (scrolling_title.getBoundingClientRect().top < 0) {
        // HACK: we must set the position:fixed here, not at intialization
        // time, because I've seen it not take.  Unknown why.
        sticky_title.style.position = 'fixed';
        sticky_title.style.visibility = 'visible';
        scrolling_title.style.visibility = 'hidden';
    } else {
        sticky_title.style.visibility = 'hidden';
        scrolling_title.style.visibility = 'visible';
    }
}
