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
    var inner = autotoc.innerHTML;
    html += "<table id=index_table>";
        html += "<thead class=sticky>";
            html += "<tr class=content_row>";
                html += "<th class=section><p></p></th>";
                html += "<th>";
                    html += inner;
                html += "</th>";
            html += "</tr>";
        html += "</thead>";
    html += "<tbody>";
    for (var i = 0; i < pg_index.length; i++) {
        row = pg_index[i];
        if ("section" in row) {
            if (i > 0) {
                html += "</tbody><tbody>";
            }
            html += "<tr class=content_row>";
            html += '<td class=section rowspan=' + row.section_size + '><p>'
                    + row.section + "</p></td>";
        } else {
            html += "<tr class=content_row>";
        }
        toc_type = row.concept ? 'concept' : 'project';
        title_cell =
            '<td class="' + toc_type + '"><p>'
            + '<a href="' + row.filename + '">'
                + row.title
                + '<span></span>' // Required to make container clickable - see CSS
                + '</a>'
            + '</p></td>';
        html += title_cell;
        html += "</tr>";
    }
    html += "</tbody></table>";
    autotoc.innerHTML = html;
});

