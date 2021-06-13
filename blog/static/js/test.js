const videoElement =
    document.getElementsByClassName('input_video')[0];
//const canvasElement =
    //document.getElementsByClassName('output_canvas')[0];
//var canvasCtx = canvasElement.getContext('2d');
var resultElement = 
  document.getElementById('result');

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
  if(landmarks == null) {
    setTimeout(sendPos, 100);
    return;
  }
  $.ajax({
    type: "POST",
    url: "/ajax", 
    data: JSON.stringify(landmarks),
    dataType: "json",
    success:function(data){
      if(data.word != '') {
        resultElement.innerHTML = data.word;
        //console.log(data.word);
      }
      sendPos();
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
 