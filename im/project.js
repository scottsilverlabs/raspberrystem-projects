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

    var title = document.getElementById("title");
    title.innerHTML +=  pg_index[pos].title;

});

