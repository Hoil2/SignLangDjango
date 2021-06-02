const videoElement =
    document.getElementsByClassName('input_video')[0];
const canvasElement =
    document.getElementsByClassName('output_canvas')[0];
var canvasCtx = canvasElement.getContext('2d');
var resultElement = 
  document.getElementById('result');

var landmarks = null;
function onResults(results) {
  // Draw the overlays.
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.image, 0, 0, canvasElement.width, canvasElement.height);

    canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
  
  if (results.multiHandLandmarks && results.multiHandedness) {
    // 손 개수만큼 반복
    landmarks = results.multiHandLandmarks;
    //for (let index = 0; index < results.multiHandLandmarks.length; index++) {
      //const classification = results.multiHandedness[index];
      //landmarks = results.multiHandLandmarks[index];
      // landmarks는 21개의 배열이고, 각각 좌표값을 가지고 있음.
      // 좌측 맨 위가 0,0 우측 맨 아래가 1,1의 좌표로 구성됨
      // 실제 좌표로 변환하려면 canvas 해상도를 곱해주면 됨\
    //}
  }
}

function sendImage() {
  if(landmarks == null) {
    setTimeout(sendImage, 100);
    return;
  }
  //while(!landmarks) {}
  //var dataURL = canvasElement.toDataURL();
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
      sendImage();
    },
    error: function(xhr, ajaxOptions, thrownError) {
      alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      sendImage();
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

window.onload = function() {
  setTimeout(sendImage, 100);
}
