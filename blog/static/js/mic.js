micImgPath = '/blog/static/img/mic.gif';
micPlayImgPath = '/blog/static/img/mic-animate.gif';
micSlashPath = '/blog/static/img/mic-slash.gif';

var resultElement = 
  document.getElementById('results');

var langs =
      [['한국어',            ['ko-KR']]];

for (var i = 0; i < langs.length; i++) {
    select_language.options[i] = new Option(langs[i][0], i);
}
updateCountry();
//showInfo('info_start');

function updateCountry() {
for (var i = select_dialect.options.length - 1; i >= 0; i--) {
    select_dialect.remove(i);
}
var list = langs[select_language.selectedIndex];
for (var i = 1; i < list.length; i++) {
    select_dialect.options.add(new Option(list[i][1], list[i][0]));
}
select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
}

var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;

if (!('webkitSpeechRecognition' in window)) { //Web Speech API를 지원하지않는 경우
upgrade();
} else {
start_button.style.display = 'inline-block';
var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;

recognition.onstart = function() { //음성인식 시작
    resultElement.innerHTML = "";
    recognizing = true;
    //showInfo('info_speak_now');
    start_img.src = micPlayImgPath;
};

recognition.onerror = function(event) { //음성인식 오류
    if (event.error == 'no-speech') {
    start_img.src = micImgPath;
    //showInfo('info_no_speech');
    ignore_onend = true;
    }
    if (event.error == 'audio-capture') { //마이크 인식 오류
    start_img.src = micImgPath;
    //showInfo('info_no_microphone');
    ignore_onend = true;
    }
    if (event.error == 'not-allowed') { //마이크 권한 거부
    if (event.timeStamp - start_timestamp < 100) {
        //showInfo('info_blocked');
    } else {
        //showInfo('info_denied');
    }
    ignore_onend = true;
    }
};

recognition.onend = function() {
    recognizing = false;
    if (ignore_onend) {
    return;
    }
    start_img.src = micImgPath;
    if (!final_transcript) {
    //showInfo('info_start');
    return;
    }
    //showInfo('');
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
        //var range = document.createRange();
        //range.selectNode(document.getElementById('final_span'));
        //window.getSelection().addRange(range);
    }
};

recognition.onresult = function(event) {
    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
    } else {
        interim_transcript += event.results[i][0].transcript;
    }
    }
    final_transcript = capitalize(final_transcript);
    //final_span.innerHTML = linebreak(final_transcript);
    resultElement.innerHTML = linebreak(interim_transcript); // 수정한 부분
    if (final_transcript || interim_transcript) {
    showButtons('inline-block');
    }
    answer(resultElement.innerHTML);
};
}

//브라우저 업그레이드
function upgrade() {
start_button.style.visibility = 'hidden';
//showInfo('info_upgrade');
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function startButton(event) {
if (recognizing) {
    recognition.stop();
    return;
}
final_transcript = '';
//recognition.lang = select_dialect.value;
recognition.start();
ignore_onend = false;
//final_span.innerHTML = '';
//interim_span.innerHTML = '';
start_img.src = micSlashPath;
//showInfo('info_allow');
showButtons('none');
start_timestamp = event.timeStamp;
}
/*
function showInfo(s) {
if (s) {
    for (var child = info.firstChild; child; child = child.nextSibling) {
    if (child.style) {
        child.style.display = child.id == s ? 'inline' : 'none';
    }
    }
    info.style.visibility = 'visible';
} else {
    info.style.visibility = 'hidden';
}
}*/

var current_style;
function showButtons(style) {
if (style == current_style) {
    return;
}
current_style = style;
}