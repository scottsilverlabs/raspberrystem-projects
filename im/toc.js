chainedOnload(function() {
    var autotoc = document.getElementsByClassName("autotoc")[0];
    var html = ""
    for (var i = 0; i < pg_index.length; i++) {
        toc_type = pg_index[i].concept ? 'concept' : 'project';
        html += 
            '<p class="toc ' + toc_type + '">'
            + '<a href="' + pg_index[i].filename + '">' + pg_index[i].title + '</a>'
            + '</p>';
    }
    autotoc.innerHTML = html;
    alert
});

