chainedOnload(function() {
    scrolling_title_div = document.getElementsByClassName('sticky')[0];
    clone = scrolling_title_div.cloneNode(true); // true means clone all childNodes and all event handlers
    clone.className += " stuck";
    clone.style.position = 'fixed';
    clone.style.top = 0;
    clone.style.marginTop = 0;
    clone.style.zIndex += 10000;
    clone.style.visibility = 'hidden';

    var header = document.getElementsByTagName("header")[0];
    fixed_title_div = header.appendChild(clone);

    updateSticky();
    window.addEventListener("resize", updateSticky);
    window.addEventListener("scroll", updateSticky);
});

function updateSticky() {
    fixed_title_div.style.width = 
        window.getComputedStyle(scrolling_title_div).getPropertyValue('width');
    if (window.scrollY > scrolling_title_div.offsetTop) {
        fixed_title_div.style.visibility = 'visible';
        scrolling_title_div.style.visibility = 'hidden';
    } else {
        fixed_title_div.style.visibility = 'hidden';
        scrolling_title_div.style.visibility = 'visible';
    }
}
