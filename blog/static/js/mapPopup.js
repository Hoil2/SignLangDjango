function answer() {
    var list = document.getElementById("txt").value;
    var ans = "";
    
    //사무실 위치
	if(check(list, "사무실", "어디")) {
        var info = "";

        if(check(list, "융소과"))
            info = "CS";
        else if(check(list, "정통과"))
            info = "IC";
        else if(check(list, "게임과"))
            info = "Game";
        else if(check(list, "IT과"))
            info = "IT";
        else if(check(list, "간호과"))
            info = "Nur";
        else {
            alert("똑바로 입력해");
            return;
        }
        //alert(ans);
        officeInfo(info);
        return;
    }
        
    else if(check(list, "위치")) {
        //새탭 띄워서 맵 출력
        var location = "";
        if(check(list, "효행관"))
            location = "hyo";
        else if(check(list, "효관"))
            location = "hyo";
        else if(check(list, "예의관"))
            location = "yeui";
        else if(check(list, "충의관"))
            location = "chung";
        else if(check(list, "승태관"))
            location = "seung";
        else if(check(list, "창업관"))
            location = "chang";
        else if(check(list, "송림관"))
            location = "song";
        else if(check(list, "기념관"))
            location = "gi";
        else if(check(list, "소석수련원"))
            location = "so";
        else {
            console.log("저장되지 않은 위치입니다.");
            return;
        }
        mapPopup(location);
        return;
    }
	else
        ans = "잘못되었습니다. 다시 입력해주세요";
    console.log(ans);
    alert(ans);
}

// 여러 개의 동적 매개변수를 받을 때 arguments를 사용
function check(list) {
    for(var i = 1; i < arguments.length; i++) {
        if(list.indexOf(arguments[i]) < 0) {
            return false;
        }
    }
    return true;
}

// 맵 팝업 새 창으로 띄우는 함수
function mapPopup(location) {
    var url = "mapPopup.html?location="+location;
    var name = "mapPopup";
    var option = "width = 800, height = 600, location = no"
    window.open(url, name, option);
}

function officeInfo(info) {
    var url = "officeInfo.html?location="+info;
    var name = "officeInfo";
    var option = "width = 800, height = 600, location = no"
    window.open(url, name, option);
}

// 안내 텍스트 새 창으로 띄우는 함수
function textPopup(text) {
    var url = "textPopup.html?location="+location;
    var name = "textPopup";
    var option = "width = 800, height = 600, location = no"
    window.open(url, name, option);
}

function initMap() {
    var location = urlToParam(window.location.href);
    var hyo = { lat: 37.7456345 ,lng: 127.0224000 };
    var chung = { lat: 37.7466744 ,lng: 127.0236088 };
    var yeui = { lat: 37.7477000 ,lng: 127.0245000 };
    var song = { lat: 37.7461500 ,lng: 127.0233146 };
    var gi = { lat: 37.7453241 ,lng: 127.0231119 };
    var so = { lat: 37.7448372 ,lng: 127.0216000 };
    var chang = { lat: 37.744390 ,lng: 127.0228000 };
    var seung = { lat: 37.7437500 ,lng: 127.0209281 };
    
    var loc = null;
    
    switch(location) {
        case "hyo":
            loc = hyo;
            break;
        case "chung":
            loc = chung;
            break;
        case "yeui":
            loc = yeui;
            break;
        case "song":
            loc = song;
            break;
        case "gi":
            loc = gi;
            break;
        case "so":
            loc = so;
            break;
        case "chang":
            loc = chang;
            break;
        case "seung":
            loc = seung;
            break;
    }

    var map = new google.maps.Map(
      document.getElementById('map'), {
        zoom: 18,
        center: loc
      });      

    new google.maps.Marker({
      position: loc,
      map: map,
      label:""
    });
}

// get방식으로 위치 전송한 거 변환하는 함수
function urlToParam(url) {
    var start = url.indexOf("=")+1;
    var end = url.length;
    var result = url.substring(start, end);
    return result;
}