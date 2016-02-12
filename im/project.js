var hw_types = {
    "resistor" :        
        { file : "hw_resistor.png",     item : "Resistor",      cell : "(I/O Cell)" },
    "led" :             
        { file : "hw_led.png",          item : "LED",           cell : "(I/O Cell)" },
    "button" :          
        { file : "hw_button.png",       item : "Button",        cell : "(I/O Cell)" },
    "accelerometer" :   
        { file : "hw_accelerometer.png",item : "Accelerometer", cell : "(Accel. Cell)" },
    "battery" :         
        { file : "hw_battery.png",      item : "Battery",       cell : "(YFC Cell)" },
    "led_matrix" :      
        { file : "hw_led_matrix.png",   item : "LED Matrix",    cell : "(LED Matrix Cell)" },
    "led_matrix_cable" :
        { file : "hw_led_matrix_cable.png", item : "LED Matrix Cable", cell : "(LED Matrix Cell)" },
}
var section_titles = {
    "intro" : "Introduction",
    "hw" : "Hardware",
    "sw" : "Software",
    "challenge" : "Challenges",
}

TROUBLESHOOTING_STRING = 
    'Having issues? Check out the <a href="TROUBLESHOOTING.html">Troubleshooting Guide</a>.';

chainedOnload(function() {
    var filename = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
    pos = pg_filename_to_pos[filename];

    var footer = document.getElementsByTagName("footer")[0];
    prev = pos > 0 ? pg_index[pos-1].filename : pg_index_html;
    next = pos < pg_index.length - 1 ? pg_index[pos+1].filename : pg_index_html;
    var html = '';
    html += '<div class=outer>';
        html += '<div class=inner>';
            html += '<p class=nextprev>';
                html += '<a href="' + pg_index_html + '">home</a> | '
                html += '<a href="' + prev + '">prev</a> | '
                html += '<a href="' + next + '">next</a>'
            html += '</p>';
        html += '</div>';
    html += '</div>';
    footer.innerHTML = html;

    var header = document.getElementsByTagName("header")[0];
    html = '';
    html += '<div id=title class="outer sticky">';
        html += '<div class=inner>' + pg_index[pos].title + '</div>';
    html += '</div>';
    html += '<div id=hw_header class="outer">';
        html += header.innerHTML;
    html += '</div>';
    html += '<div id=troubleshooting class=outer><div class=inner><p>' 
        + TROUBLESHOOTING_STRING +  '</p></div></div>';
    header.innerHTML = html;

    var title = document.getElementsByTagName("title")[0];
    title.innerHTML = pg_index[pos].title;

    var hw = document.getElementsByClassName("hw");
    for (i = 0; i < hw.length; i++) {
        hw[i].className += " inner";
        count = hw[i].getAttribute("data-count");
        name = hw[i].getAttribute("data-name");
        item = hw[i].getAttribute("data-item");
        if (! item) {
            item = hw_types[name].item;
        }
        cell = hw[i].getAttribute("data-cell");
        if (! cell) {
            cell = hw_types[name].cell;
        }
        html = '<table>';
        html += '<tr><td>';
        if (count > 0) {
            html += '<div class="hw_count hw_count_' + count%10 + '"><p>' + count + '</p></div>';
            html += '<div class=hw_count_separator><p>x</p></div>';
        }
        html += '<div class=hw_img><img src="img/' + hw_types[name].file + '"></div>';
        html += '</td></tr>';
        html += '<tr><td colspan=3><p>' + item + '</p></td></tr>';
        html += '<tr><td colspan=3><p>' + cell + '</p></td></tr>';
        html += '</table>';
        hw[i].innerHTML = html;
    }

    var sections = document.getElementsByClassName("section");
    for (i = 0; i < sections.length; i++) {
        var title = section_titles[sections[i].id];
        html = '<div class=section_heading><div>' + title + '</div></div>';
        sections[i].innerHTML = html + sections[i].innerHTML;
    }

    var links = document.getElementsByTagName("a");
    for (i = 0; i < links.length; i++) {
        uid = links[i].getAttribute("data-uid");
        if (uid) {
            for (j = 0; j < pg_index.length; j++) {
                if (uid == pg_index[j].uid) break;
            }
            if (j < pg_index.length) {
                links[i].href = pg_index[j].filename;
                links[i].innerHTML = pg_index[j].title;
            }
        }
    }
});

