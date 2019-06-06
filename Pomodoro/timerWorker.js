/*var minutes;
var seconds;
var ongoing;
onmessage = function(input) {
  minutes = input.data[0];
  seconds = input.data[1];
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
}*/
var inputMinutes;
var inputSeconds;
var endTime;
var timeLeft;
var currentTime;
var minutesLeft;
var secondsLeft;
var ongoing;

onmessage = function(input) {
  inputMinutes = input.data[0];
  inputSeconds = input.data[1];
  minutesLeft = inputMinutes;
  secondsLeft = inputSeconds;
  endTime = new Date().getTime();
  endTime += inputMinutes * 60 * 1000;
  endTime += inputSeconds * 1000;

  setInterval(ongoing = function() {
    currentTime = new Date().getTime();
    timeLeft = endTime - currentTime;
    if (timeLeft < 0)
    {
      clearInterval(ongoing);
    }
    minutesLeft = Math.floor(timeLeft / (1000 * 60));
    secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);
    postMessage([minutesLeft, secondsLeft]);
  }, 50);
}
