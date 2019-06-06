var minutes;
var seconds;
var ongoing;
onmessage = function(input) {
  console.log('Message received from main script');
  minutes = input.data[0];
  seconds = input.data[1];
  postMessage([minutes, seconds]);
  setInterval(ongoing = function() {
    if (seconds == 0 && minutes == 0)
    {
      clearInterval(ongoing);
    }
    if (seconds == 0) {
      seconds = 59;
      --minutes;
     }
     else {
      --seconds;
     }
     postMessage([minutes, seconds]);
  }, 1000);
}
