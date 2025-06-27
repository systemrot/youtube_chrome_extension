const timeEl = document.getElementById("time");
const resetBtn = document.getElementById("reset");
const setBtn = document.getElementById("set");
const durationInput = document.getElementById("duration");

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function updateTimeLeft() {
  chrome.runtime.sendMessage({ action: "getTimeLeft" }, (response) => {
    if (!response) return;

    const ms = response.timeLeftMs;
    if (ms <= 0) {
      timeEl.textContent = "Время вышло!";
    } else {
      timeEl.textContent = `Осталось ${formatTime(ms)}`;
    }
  });
}

function loadDurationSettings() {
  chrome.storage.local.get("durationMinutes", (data) => {
    const minutes = data.durationMinutes || 30; // Default to 30 minutes if not set
    durationInput.value = minutes;
  });
}

resetBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "resetTimer" }, (response) => {
    if (response && response.status === "ok") {
      updateTimeLeft();
    }
  });
});

setBtn.addEventListener("click", () => {
  const minutes = parseInt(durationInput.value);
  if (isNaN(minutes) || minutes <= 0) return;

  chrome.runtime.sendMessage({ action: "setDuration", minutes }, (response) => {
    if (response && response.status === "ok") {
      updateTimeLeft();
    }
  });
});

updateTimeLeft();
loadDurationSettings();
setInterval(updateTimeLeft, 1000); // Update every second
