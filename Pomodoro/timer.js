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

/*Begins the worker if it is not already begun, and then sends it the minutes and
seconds. The initial condition checks if the browser allows web workers.
Once started, everytime the web worker sends back a message the minutes and seconds
update and the updateTime function is run to update the displays.
*/
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

//Terminate the worker and then set it to be able to be run again.
function stopWorker() {
  if (typeof(worker) != "undefined") {
    worker.terminate();
    worker = undefined;
  }
}

//Starts the ripen animation,
function fruitRipenAnimation(x) {
  resetAnimation();
  fruit.style.animation = "ripen " + x + "s ease-in forwards";
}

//This function adds the tomato falling animation to whatever the current animation is.
//"dropCount" keeps track of whether another animation has been played or not
//so that this animation isn't done twice in a row.
function fruitDropAnimation() {
  if (!dropCount) {
    fruit.style.animation += ", fruitfall .5s ease-in forwards";
    dropCount = true;
  }
}

//This function begins the growing animation for x seconds.
function growAnimation(x) {
  resetAnimation();
  fruit.style.animation = "grow " + x +"s ease-in forwards";
}

/*
This function pauses the animation for when the pause button is pressed or when the timer
itself runs out. "natural" keeps track of whether the pause was because the timer ran down
or if it was because a button was pressed. The drop animation happens if a button was pressed
or if the timer ran down and now it is time for a break. The grow function then follows if
the pause was triggered by a button and it is currently a work interval not a break.
*/
function pauseAnimation() {
  if(!natural || breakTime) {
    fruitDropAnimation();
  }
  if(!breakTime && !natural) {
    setTimeout(growAnimation, 500, 1);
  }
    natural = true;
}

//Resets the animations so that they can be repeated.
function resetAnimation() {
  fruit.style.animation = "none";
  fruit.offsetHeight;
  fruit.style.animation = null;
  dropCount = false;
}

//This function picks which animation to play over time while the timer goes down.
function growOrRipenAnimation() {
  var animationSeconds = (60 * minutes) + seconds;
  if (breakTime) {
    growAnimation(animationSeconds);
  }
  else {
    fruitRipenAnimation(animationSeconds);
  }
}

//This function updates the break/work display to the current setting.
function breakTimeReset() {
  if (breakTime) {
    document.getElementById('rest').innerHTML = "Break";
  }
  else {
    document.getElementById('rest').innerHTML = "Work";
  }
}

/*
This function will update the breakTime and the timer displays. If the minutes and seconds
are zero then this function will change the times to their default values for the corresponding
work or rest intervals.
*/
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

/*
This function starts and stops the web worker when the start/pause button is pressed.
If it is currently paused and should start playing, then all of the time/input the
user chose is used to update our displays and variables, and the web worker starts and the
animation plays.
If it is currently playing and should be paused, then the web worker is stopped, animations
are paused, and the user control displays are updated.
*/
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

//This function runs when the work/break element is presed and will change the update
//everything by running updateTime.
document.getElementById("rest").addEventListener("click", function() {
  minutes = 0;
  seconds = 0;
  natural = false;
  updateTime();
});

//This function updates the display of the timer
function updateTimeDisplay() {
  document.getElementById("minutesNum").innerHTML = minutes;
  if (seconds < 10) {
    document.getElementById("secondsNum").innerHTML = "0" + seconds;
  }
  else {
    document.getElementById("secondsNum").innerHTML = seconds;
  }
}

//This function updates the display of the user control for the timer.
function updateControlDisplay() {
  document.getElementById('minutes').value = minutes;
  if(seconds < 10) {
    document.getElementById('seconds').value = '0' + seconds;
  }
  else {
    document.getElementById('seconds').value = seconds;
  }
}

//This function updates our minutes and seconds variable from the conroller.
function getTimeFromControl() {
  minutes = parseInt(document.getElementById('minutes').value);
  seconds = parseInt(document.getElementById('seconds').value);
}

//This checks whether or not the user gave us actual numbers, if they didn't then
//the variables are set to 0.
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

//This function is used to tell us whether the input is within range. If it isn't
//then we change the corresponding variables to the closest in range value.
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
  if (minutes == 0 && seconds == 0) {
    seconds = 1;
  }
  document.getElementById('pomodoroDisplay').innerHTML = pomodoroCounter;
}
