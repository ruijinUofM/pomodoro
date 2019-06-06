var control = document.getElementById("control");
var timerInterval;
var minutes = 25;
var seconds = 0;
var pomodoroCounter = 0;
var breakTime = false;
var startStop = true;
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
      console.log(input[0]);
      console.log(input[1]);
      worker.postMessage(input);
    }
  }
  worker.onmessage = function(output) {
    minutes = output.data[0];
    seconds = output.data[1];
    console.log('Message received from worker');
    startTime();
  }
}

function stopWorker() {
  worker.terminate();
  worker = undefined;
}

function fruitRipen(x) {
  reset();
  fruit.style.animation = "ripen " + x + "s ease-in forwards";
}

function fruitDrop() {
  if (!dropCount) {
    fruit.style.animation += ", fruitfall .5s ease-in forwards";
    dropCount = true;
  }
}

function grow(x) {
  reset();
  fruit.style.animation = "grow " + x +"s ease-in forwards";
}

function pause() {
  if(!natural || breakTime) {
    fruitDrop();
  }
  if(!breakTime && !natural) {
    setTimeout(grow, 500, 1);
  }
    natural = true;
}

function reset() {
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

function growOrRipen() {
  var animationSeconds = (60 * minutes) + seconds;
  if (breakTime) {
    grow(animationSeconds);
  }
  else {
    fruitRipen(animationSeconds);
  }
}

function startTime() {
  document.getElementById("minutesNum").innerHTML = minutes;
  if (seconds < 10) {
    document.getElementById("secondsNum").innerHTML = "0" + seconds;
  }
  else {
    document.getElementById("secondsNum").innerHTML = seconds;
  }
  updateTime();
 }

function updateTime() {

  if (minutes == 0 && seconds == 0) {
//!!
    stopWorker();

    breakTime = !breakTime;
    breakTimeReset();

    startStop = true;
    pause();

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
    document.getElementById('minutes').value = minutes;
    document.getElementById('seconds').value = "00";

    document.getElementById('timer').style.zIndex = '1';
    document.getElementById('pomodoroControl').style.zIndex = '1';

  }
}

control.addEventListener("click", function()
  {
    if (startStop) {
      pomodoroCounter = document.getElementById('pomodoroControl').value;

      minutes = document.getElementById('minutes').value;
      seconds = document.getElementById('seconds').value;

      if(seconds.length >= 3) {
        seconds = seconds.substring(seconds.length - 2, seconds.length);
      }

      if(seconds.substring(0,1) == "0") {
        seconds = seconds.substring(1,2);
      }

      checkUser();
      startWorker();
      growOrRipen();
//!!
      startStop = false;
      control.innerHTML = "Pause";
      document.getElementById('timer').style.zIndex = '-1';
      document.getElementById('pomodoroControl').style.zIndex = '-1';
    }

    else {
      natural = false;
      pause();
      document.getElementById('minutes').value = minutes;
      if(seconds < 10 && seconds > 0) {
        document.getElementById('seconds').value = '0' + seconds;
      }
      else {
        document.getElementById('seconds').value = seconds;
      }
//!!
      stopWorker();
      startStop = true;
      control.innerHTML = "Start";
      document.getElementById('pomodoroControl').value = pomodoroCounter;
      document.getElementById('timer').style.zIndex = '1';
      document.getElementById('pomodoroControl').style.zIndex = '1';
    }
  }
);

document.getElementById("rest").addEventListener("click", function() {
  if(!startStop) {
    stopWorker();
  }

  minutes = 0;
  seconds = 0;
  natural = false;
  startWorker();
});

function checkUser() {
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
  document.getElementById('pomodoroDisplay').innerHTML = pomodoroCounter;
}
