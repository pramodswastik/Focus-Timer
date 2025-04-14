let isRunning = false;
let isBreak = false;
let timerInterval;
let timeLeft;
let totalTime;
let alarmWaiting = false;

const timerDisplay = document.getElementById('timer');
const statusDisplay = document.getElementById('status');
const alarm = document.getElementById('alarm');
const alarmOverlay = document.getElementById('alarmOverlay');
const stopAlarmBtn = document.getElementById('stopAlarmBtn');
const overlayText = document.getElementById('overlayMessage');
const circle = document.querySelector('.progress-ring__circle');

const workInput = document.getElementById('workInput');
const breakInput = document.getElementById('breakInput');

const RADIUS = 100;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
circle.style.strokeDasharray = CIRCUMFERENCE;

function setProgress(percent) {
  const offset = CIRCUMFERENCE - percent * CIRCUMFERENCE;
  circle.style.strokeDashoffset = offset;
}

alarm.loop = true;

function getTimes() {
  const workTime = parseInt(workInput.value) || 25;
  const breakTime = parseInt(breakInput.value) || 5;
  return { workTime, breakTime };
}

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progress = 1 - timeLeft / totalTime;
  setProgress(progress);
}

function switchMode() {
  const { workTime, breakTime } = getTimes();
  isBreak = !isBreak;
  totalTime = timeLeft = (isBreak ? breakTime : workTime) * 60;
  statusDisplay.textContent = isBreak ? 'Break' : 'Session';
  updateDisplay();
}

function showAlarmPopup() {
  overlayText.textContent = isBreak ? "💪 Break over! Let’s get back to work." : "🎉 Good job! Time for a break.";
  alarmOverlay.classList.remove('hidden');
  alarm.play();
  alarmWaiting = true;
}

function hideAlarmPopup() {
  alarm.pause();
  alarm.currentTime = 0;
  alarmOverlay.classList.add('hidden');
  alarmWaiting = false;
  switchMode();
  startTimer();
}

function startTimer() {
  if (isRunning || alarmWaiting) return;

  const { workTime, breakTime } = getTimes();
  if (!timeLeft) {
    totalTime = timeLeft = (isBreak ? breakTime : workTime) * 60;
  }

  isRunning = true;

  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      clearInterval(timerInterval);
      isRunning = false;
      showAlarmPopup();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  isRunning = false;
}

function resetTimer() {
  stopTimer();
  isBreak = false;
  const { workTime } = getTimes();
  totalTime = timeLeft = workTime * 60;
  statusDisplay.textContent = 'Session';
  updateDisplay();
  if (alarmWaiting) {
    hideAlarmPopup();
  }
}

stopAlarmBtn.addEventListener('click', hideAlarmPopup);
document.getElementById('start').addEventListener('click', startTimer);
document.getElementById('stop').addEventListener('click', stopTimer);
document.getElementById('reset').addEventListener('click', resetTimer);

resetTimer();
