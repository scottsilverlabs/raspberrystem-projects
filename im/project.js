var hw_types = {
    "resistor" :    { file : "hw_resistor.png",     item : "Resistor",          cell : "(I/O Cell)" },
    "led" :         { file : "hw_led.png",          item : "LED",               cell : "(I/O Cell)" },
}

chainedOnload(function() {
    var filename = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
    pos = pg_filename_to_pos[filename];

    var footer = document.getElementById("footer");
    prev = pos > 0 ? pg_index[pos-1].filename : pg_index_html;
    next = pos < pg_index.length - 1 ? pg_index[pos+1].filename : pg_index_html;
    footer.innerHTML +=
        '<p class=nextprev>'
        + '<a href="' + pg_index_html + '">home</a> | '
        + '<a href="' + prev + '">prev</a> | '
        + '<a href="' + next + '">next</a>'
        + '</p>';

    var header = document.getElementsByTagName("header")[0];
    html = '';
    html += '<div id=title class="outer sticky"><div class=inner>' + pg_index[pos].title + '</div></div>';
    html += '<div id=hw_header class="outer">';
    html += header.innerHTML;
    html += '</div>';
    header.innerHTML = html;

    var title = document.getElementsByTagName("title")[0];
    title.innerHTML = pg_index[pos].title;

    var hw = document.getElementsByClassName("hw");
    for (i = 0; i < hw.length; i++) {
        hw[i].className += " inner";
        count = hw[i].getAttribute("data-count");
        name = hw[i].getAttribute("data-name");
        html = '<table>';
        html += '<tr><td>';
        if (count > 0) {
            html += '<div class="hw_count hw_count_' + count%10 + '"><p>' + count + '</p></div>';
            html += '<div class=hw_count_separator><p>x</p></div>';
        }
        html += '<div class=hw_img><img src="img/' + hw_types[name].file + '"></div>';
        html += '</td></tr>';
        html += '<tr><td colspan=3><p>' + hw_types[name].item + '</p></td></tr>';
        html += '<tr><td colspan=3><p>' + hw_types[name].cell + '</p></td></tr>';
        html += '</table>';
        hw[i].innerHTML = html;
    }
});

