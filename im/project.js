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
    "resistor_yfc" :        
        { file : "hw_resistor.png",     item : "Resistor",      cell : "(YFC Cell)" },
    "led_yfc" :             
        { file : "hw_led.png",          item : "LED",           cell : "(YFC Cell)" },
    "led_matrix" :      
        { file : "hw_led_matrix.png",   item : "LED Matrix",    cell : "(LED Matrix Cell)" },
    "led_matrix_cable" :
        { file : "hw_led_matrix_cable.png", item : "LED Matrix Cable", cell : "(LED Matrix Cell)" },
    "audio_cable" :
        { file : "hw_audio_cable.png",  item : "Audio Cable",   cell : "(Speaker Cell)" },
    "speaker" :
        { file : "hw_speaker.png",      item : "Speaker",       cell : "(Speaker Cell)" },
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

    var body = document.getElementsByTagName("body")[0];

    /*
     * Assemble HW portion of header, if exists
     */
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

    /*
     * Create header
     */
    var header_html = '';
    header_html += '<header>';
    header_html += '<div id=title class="outer sticky">';
        header_html += '<div class=inner>' + pg_index[pos].title + '</div>';
    header_html += '</div>';
    /* Only add HW/Troubleshooting portion of header if HW is given */
    if (hw.length > 0) {
        header_html += '<div id=hw_header class="outer">';
        for (i = 0; i < hw.length; i++) {
            header_html += hw[i].outerHTML;
        }
        header_html += '</div>';
        header_html += '<div id=troubleshooting class=outer><div class=inner><p>' 
            + TROUBLESHOOTING_STRING +  '</p></div></div>';
    }
    header_html += '</header>';

    /*
     * Create footer
     */
    prev = pos > 0 ? pg_index[pos-1].filename : pg_index_html;
    next = pos < pg_index.length - 1 ? pg_index[pos+1].filename : pg_index_html;
    var footer_html = '';
    footer_html += '<div class=outer>';
        footer_html += '<div class=inner>';
            footer_html += '<p class=nextprev>';
                footer_html += '<a href="' + pg_index_html + '">home</a> | '
                footer_html += '<a href="' + prev + '">prev</a> | '
                footer_html += '<a href="' + next + '">next</a>'
            footer_html += '</p>';
        footer_html += '</div>';
    footer_html += '</div>';

    /*
     * Remove original header hw node
     */
    while(hw.length > 0){
        hw[0].parentNode.removeChild(hw[0]);
    }

    /* Add header/footer */
    body.innerHTML = header_html + body.innerHTML + footer_html;

    var title = document.getElementsByTagName("title")[0];
    title.innerHTML = pg_index[pos].title;

    var sections = document.getElementsByClassName("section");
    for (i = 0; i < sections.length; i++) {
        var section_title = section_titles[sections[i].id];
        if (section_title != undefined) {
            var html = '<div class=section_heading><div>' + section_title + '</div></div>';
            sections[i].innerHTML = html + sections[i].innerHTML;
        }
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

