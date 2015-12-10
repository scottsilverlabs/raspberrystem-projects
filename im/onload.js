function chainedOnload(next_onload) {
    var prev_onload = window.onload ? window.onload : function(){};
    window.onload = function() {
        prev_onload();
        next_onload();
    }
}

