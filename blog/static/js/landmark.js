const videoElement =
    document.getElementsByClassName('input_video')[0];
const canvasElement =
    document.getElementsByClassName('output_canvas')[0];
var canvasCtx = canvasElement.getContext('2d');
var resultElement = 
  document.getElementById('results');

var startTime = new Date();
var endTime = new Date();
var timer = 0;
var landmarks = null;
function onResults(results) {
  // Draw the overlays.
  
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
  
  if (results.multiHandLandmarks && results.multiHandedness) {
    // 손 개수만큼 반복
    landmarks = results.multiHandLandmarks;
    
    for (let index = 0; index < results.multiHandLandmarks.length; index++) {
      const classification = results.multiHandedness[index];
      const isRightHand = classification.label === 'Right';
      const landmarks = results.multiHandLandmarks[index];
      // landmarks는 21개의 배열이고, 각각 좌표값을 가지고 있음.
      // 좌측 맨 위가 0,0 우측 맨 아래가 1,1의 좌표로 구성됨
      // 실제 좌표로 변환하려면 canvas 해상도를 곱해주면 됨
      //console.log(landmarks[0].x * 1280 + "," + landmarks[0].y * 720);
      // 랜드마크 그리는 부분
      drawConnectors(
          canvasCtx, landmarks, HAND_CONNECTIONS,
          {color:'#00FF00'}),
      drawLandmarks(canvasCtx, landmarks, {
        color:  '#00FF00' ,
        fillColor: '#FF0000',
        radius: (x) => {
          //console.log(x);
          return lerp(x.from.z, -0.15, .1, 10, 1);
        }
      });
    }
    
    // landmarks는 2차원 배열이고, 각각 좌표값을 가지고 있음.
    // 좌측 맨 위가 0,0 우측 맨 아래가 1,1의 좌표로 구성됨
    // 실제 좌표로 변환하려면 canvas 해상도를 곱해주면 됨\
    // landmarks[0] : 첫번째 손
    // landmarks[0][0].x : 첫번째 손의 0번 id의 x좌표
  }
}

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/${file}`;
}});

hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: 960,
  height: 600
});
camera.start();