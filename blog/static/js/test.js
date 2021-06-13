const videoElement =
    document.getElementsByClassName('input_video')[0];
//const canvasElement =
    //document.getElementsByClassName('output_canvas')[0];
//var canvasCtx = canvasElement.getContext('2d');
var resultElement = 
  document.getElementById('result');

var startTime = new Date();
var endTime = new Date();
var timer = 0;
var landmarks = null;
function onResults(results) {
  // Draw the overlays.
  /*
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.image, 0, 0, canvasElement.width, canvasElement.height);

    canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
  */
  if (results.multiHandLandmarks && results.multiHandedness) {
    // 손 개수만큼 반복
    landmarks = results.multiHandLandmarks;
    // landmarks는 2차원 배열이고, 각각 좌표값을 가지고 있음.
    // 좌측 맨 위가 0,0 우측 맨 아래가 1,1의 좌표로 구성됨
    // 실제 좌표로 변환하려면 canvas 해상도를 곱해주면 됨\
    // landmarks[0] : 첫번째 손
    // landmarks[0][0].x : 첫번째 손의 0번 id의 x좌표
  }
}

function sendPos() {
  if(landmarks == null || recognizing) {
    setTimeout(sendPos, 100);
    return;
  }
  endTime = new Date()
  time = endTime.getTime() - startTime.getTime();
  time /= 1000;
  if(time > 2) {
    resultElement.innerHTML = "";
  }
  $.ajax({
    type: "POST",
    url: "/ajax", 
    data: JSON.stringify(landmarks),
    dataType: "json",
    success:function(data){
      if(data.word != '' && data.acc >= 95) {
        if(time <= 2) {
          startTime = new Date();
          resultElement.innerHTML += " " + data.word;
        }
        else {
          startTime = new Date();
          resultElement.innerHTML = data.word;
        }
        setTimeout(sendPos, 500);
        //console.log(data.word);
      }
      else {
        sendPos();
      }
    },
    error: function(request,status,error) {
      sendPos();
    }
  })
}

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/${file}`;
}});

hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: 1280,
  height: 720
});
camera.start();

$.ajax({
  type: "POST",
  url: "/init", 
  success:function(data){
    console.log(data.ip);
  }
})

window.onload = function() {
  setTimeout(sendPos, 100);
}


var langs =
      [['Afrikaans',       ['af-ZA']],
      ['Bahasa Indonesia',['id-ID']],
      ['Bahasa Melayu',   ['ms-MY']],
      ['Català',          ['ca-ES']],
      ['Čeština',         ['cs-CZ']],
      ['Deutsch',         ['de-DE']],
      ['English',         ['en-AU', 'Australia'],
                          ['en-CA', 'Canada'],
                          ['en-IN', 'India'],
                          ['en-NZ', 'New Zealand'],
                          ['en-ZA', 'South Africa'],
                          ['en-GB', 'United Kingdom'],
                          ['en-US', 'United States']],
      ['Español',         ['es-AR', 'Argentina'],
                          ['es-BO', 'Bolivia'],
                          ['es-CL', 'Chile'],
                          ['es-CO', 'Colombia'],
                          ['es-CR', 'Costa Rica'],
                          ['es-EC', 'Ecuador'],
                          ['es-SV', 'El Salvador'],
                          ['es-ES', 'España'],
                          ['es-US', 'Estados Unidos'],
                          ['es-GT', 'Guatemala'],
                          ['es-HN', 'Honduras'],
                          ['es-MX', 'México'],
                          ['es-NI', 'Nicaragua'],
                          ['es-PA', 'Panamá'],
                          ['es-PY', 'Paraguay'],
                          ['es-PE', 'Perú'],
                          ['es-PR', 'Puerto Rico'],
                          ['es-DO', 'República Dominicana'],
                          ['es-UY', 'Uruguay'],
                          ['es-VE', 'Venezuela']],
      ['Euskara',         ['eu-ES']],
      ['Français',        ['fr-FR']],
      ['Galego',          ['gl-ES']],
      ['Hrvatski',        ['hr_HR']],
      ['IsiZulu',         ['zu-ZA']],
      ['Íslenska',        ['is-IS']],
      ['Italiano',        ['it-IT', 'Italia'],
                          ['it-CH', 'Svizzera']],
      ['Magyar',          ['hu-HU']],
      ['Nederlands',      ['nl-NL']],
      ['Norsk bokmål',    ['nb-NO']],
      ['Polski',          ['pl-PL']],
      ['Português',       ['pt-BR', 'Brasil'],
                          ['pt-PT', 'Portugal']],
      ['Română',          ['ro-RO']],
      ['Slovenčina',      ['sk-SK']],
      ['Suomi',           ['fi-FI']],
      ['Svenska',         ['sv-SE']],
      ['Türkçe',          ['tr-TR']],
      ['български',       ['bg-BG']],
      ['Pусский',         ['ru-RU']],
      ['Српски',          ['sr-RS']],
      ['한국어',            ['ko-KR']],
      ['中文',             ['cmn-Hans-CN', '普通话 (中国大陆)'],
                          ['cmn-Hans-HK', '普通话 (香港)'],
                          ['cmn-Hant-TW', '中文 (台灣)'],
                          ['yue-Hant-HK', '粵語 (香港)']],
      ['日本語',           ['ja-JP']],
      ['Lingua latīna',   ['la']]];

      for (var i = 0; i < langs.length; i++) {
        select_language.options[i] = new Option(langs[i][0], i);
      }
      select_language.selectedIndex = 28; //디폴트 언어 설정
      updateCountry();
      select_dialect.selectedIndex = 6; //언어가 겹치는 국가 설정 ex)영국 미국
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
          start_img.src = '/blog/static/img/mic-animate.gif';
        };

        recognition.onerror = function(event) { //음성인식 오류
          if (event.error == 'no-speech') {
            start_img.src = '/blog/static/img/mic.gif';
            //showInfo('info_no_speech');
            ignore_onend = true;
          }
          if (event.error == 'audio-capture') { //마이크 인식 오류
            start_img.src = '/blog/static/img/mic.gif';
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
          start_img.src = '/blog/static/img/mic.gif';
          if (!final_transcript) {
            //showInfo('info_start');
            return;
          }
          //showInfo('');
          if (window.getSelection) {
            window.getSelection().removeAllRanges();
            var range = document.createRange();
            range.selectNode(document.getElementById('final_span'));
            window.getSelection().addRange(range);
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
        final_span.innerHTML = '';
        interim_span.innerHTML = '';
        start_img.src = '/blog/static/img/mic-slash.gif';
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