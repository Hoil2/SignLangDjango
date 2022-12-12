function initInfo() {
    var info = urlToParam(window.location.href);    
    var loc = "";
    var tel = "";
    var bigo = "";
    var img = "";

    if(info == "CS") {
        document.write("<img width=700 height=400 src=\'/blog/static/img/3floor.jpg'>");
    }
    else if (info == "IC") {
        document.write("<img width=700 height=400 src=\"/blog/static/img/3floor.jpg\">");
    }
    else if (info == "Game") {
        document.write("<img width=700 height=400 src=\"/blog/static/img/3floor.jpg\">");
    }
    else if (info == "IT") {
        document.write("<img width=700 height=400 src=\"/blog/static/img/3floor.jpg\">");
    }
    else if (info == "Vid") {
        document.write("<img width=700 height=400 src=\"/blog/static/img/3floor.jpg\">");
    }
}

function urlToParam(url) {
    var start = url.indexOf("=")+1;
    var end = url.length;
    var result = url.substring(start, end);
    return result;
}

initInfo();