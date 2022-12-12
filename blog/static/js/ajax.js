function sendPos() {
  if(landmarks == null || recognizing) {
    
    setTimeout(sendPos, 17);
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
      if(data.word != '' && data.acc >= 80) {
        if(resultElement.innerHTML.indexOf(data.word) < 0) {
          startTime = new Date();
          if(time <= 2) {
            resultElement.innerHTML += " " + data.word;
            answer(resultElement.innerHTML);
          }
          else {
            resultElement.innerHTML = data.word;
          }
        }
        //console.log(data.word);
      }
      sendPos();
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
  setTimeout(sendPos, 16);
}