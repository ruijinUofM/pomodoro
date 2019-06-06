var control = document.getElementById("control");
var timerInterval;
var minutes = 25;
var seconds = 0;
var pomodoroCounter = 0;
var breakTime = false;
var currentlyPaused = true;
var fruit = document.getElementById("fruit");
var dropCount = false;
var natural = true;
var worker;
var input;

function startWorker() {
  if (typeof(Worker) !== "undefined") {
    if (typeof(worker) == "undefined") {
      worker = new Worker("timerWorker.js");
      input = [minutes, seconds];
      worker.postMessage(input);
    }
  }
  worker.onmessage = function(output) {
    minutes = output.data[0];
    seconds = output.data[1];
    updateTime();
  }
}

function stopWorker() {
  if (typeof(worker) != "undefined") {
    worker.terminate();
    worker = undefined;
  }
}

function fruitRipenAnimation(x) {
  resetAnimation();
  fruit.style.animation = "ripen " + x + "s ease-in forwards";
}

function fruitDropAnimation() {
  if (!dropCount) {
    fruit.style.animation += ", fruitfall .5s ease-in forwards";
    dropCount = true;
  }
}

function growAnimation(x) {
  resetAnimation();
  fruit.style.animation = "grow " + x +"s ease-in forwards";
}

function pauseAnimation() {
  if(!natural || breakTime) {
    fruitDropAnimation();
  }
  if(!breakTime && !natural) {
    setTimeout(growAnimation, 500, 1);
  }
    natural = true;
}

function resetAnimation() {
  fruit.style.animation = "none";
  fruit.offsetHeight;
  fruit.style.animation = null;
  dropCount = false;
}

function breakTimeReset() {
  if (breakTime) {
    document.getElementById('rest').innerHTML = "Break";
  }
  else {
    document.getElementById('rest').innerHTML = "Work";
  }
}

function growOrRipenAnimation() {
  var animationSeconds = (60 * minutes) + seconds;
  if (breakTime) {
    growAnimation(animationSeconds);
  }
  else {
    fruitRipenAnimation(animationSeconds);
  }
}

function updateTime() {

  if (minutes == 0 && seconds == 0) {

    stopWorker();

    breakTime = !breakTime;
    breakTimeReset();

    currentlyPaused = true;

    pauseAnimation();

    control.innerHTML = "Start";
    if (breakTime) {
      if (++pomodoroCounter == 4) {
        minutes = 15;
        pomodoroCounter = 0;
      }
      else {
        minutes = 3;
      }
    }
    else {
      minutes = 25;
    }
    document.getElementById('pomodoroControl').value = pomodoroCounter;
    document.getElementById('pomodoroDisplay').innerHTML = pomodoroCounter;
    updateControlDisplay();

    document.getElementById('timer').style.zIndex = '1';
    document.getElementById('pomodoroControl').style.zIndex = '1';

  }
  updateTimeDisplay();
}

control.addEventListener("click", function()
  {
    if (currentlyPaused) {
      pomodoroCounter = parseInt(document.getElementById('pomodoroControl').value);
      getTimeFromControl();
      checkReceivedNumbers();
      checkUserInput();
      updateTimeDisplay();
      startWorker();
      growOrRipenAnimation();

      currentlyPaused = false;
      control.innerHTML = "Pause";
      document.getElementById('timer').style.zIndex = '-1';
      document.getElementById('pomodoroControl').style.zIndex = '-1';
    }

    else {
      natural = false;
      pauseAnimation();

      stopWorker();
      currentlyPaused = true;
      control.innerHTML = "Start";
      updateControlDisplay();
      document.getElementById('pomodoroControl').value = pomodoroCounter;
      document.getElementById('timer').style.zIndex = '1';
      document.getElementById('pomodoroControl').style.zIndex = '1';
    }
  }
);

document.getElementById("rest").addEventListener("click", function() {
  minutes = 0;
  seconds = 0;
  natural = false;
  updateTime();
});

function updateTimeDisplay() {
  document.getElementById("minutesNum").innerHTML = minutes;
  if (seconds < 10) {
    document.getElementById("secondsNum").innerHTML = "0" + seconds;
  }
  else {
    document.getElementById("secondsNum").innerHTML = seconds;
  }
}

function updateControlDisplay() {
  document.getElementById('minutes').value = minutes;
  if(seconds < 10) {
    document.getElementById('seconds').value = '0' + seconds;
  }
  else {
    document.getElementById('seconds').value = seconds;
  }
}

function getTimeFromControl() {
  minutes = parseInt(document.getElementById('minutes').value);
  seconds = parseInt(document.getElementById('seconds').value);
}

function checkReceivedNumbers() {
  if (isNaN(seconds)) {
    seconds = 0;
  }
  if (isNaN(minutes)) {
    minutes = 0;
  }
  if (isNaN(pomodoroCounter)) {
    pomodoroCounter = 0;
  }
}

function checkUserInput() {
  if (minutes < 0) {
    minutes = 0;
  }
  if (seconds < 0) {
    seconds = 0;
  }
  if (minutes > 59) {
    minutes = 59;
  }
  if (seconds > 59) {
    seconds = 59;
  }
  if (pomodoroCounter > 3) {
    pomodoroCounter = 3;
  }
  if (pomodoroCounter < 0) {
    pomodoroCounter = 0;
  }
  if (minutes == 0 && seconds == 0 && pomodoroCounter == 0) {
    seconds = 1;
  }
  document.getElementById('pomodoroDisplay').innerHTML = pomodoroCounter;
}
