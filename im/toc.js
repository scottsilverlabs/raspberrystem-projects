chainedOnload(function() {
    var autotoc = document.getElementsByClassName("autotoc")[0];

    // Calc size of each section.  For each pg_index item that has a 'section',
    // it is the number of entries up until the next section.
    var section_size = 0;
    var section_index = 0;
    for (var i = 0; i < pg_index.length; i++) {
        if ("section" in pg_index[i]) {
            if (i > 0) {
                pg_index[section_index].section_size = section_size;
            }
            section_size = 1;
            section_index = i;
        } else {
            section_size++;
        }
    }
    pg_index[section_index].section_size = section_size;

    var html = "";
    html += "<table>";
    for (var i = 0; i < pg_index.length; i++) {
        row = pg_index[i];
        html += "<tr>";
        if ("section" in row) {
            html += '<td class="section" rowspan=' + row.section_size + '><p>' 
                    + row.section + "</p></td>";
        }
        toc_type = row.concept ? 'concept' : 'project';
        title_cell = 
            '<td class="' + toc_type + '"><p>'
            + '<a href="' + row.filename + '">' + row.title + '</a>'
            + '</p></td>';
        blank_cell = "<td></td>";
        if (row.concept) {
            html += title_cell + blank_cell;
        } else {
            html += blank_cell + title_cell;
        }
        html += "</tr>";
    }
    html += "</table>";
    autotoc.innerHTML = html;
    alert
});

