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
/*
$.ajax({
  type: "POST",
  url: "/init", 
  success:function(data){
    console.log(data.ip);
  }
})
*/
window.onload = function() {
  //setTimeout(sendPos, 100);
}