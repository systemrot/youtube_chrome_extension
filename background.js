const ALARM_NAME = "youtube-timer";

function startTimer() {
  chrome.storage.local.get("durationMinutes", (data) => {
    const minutes = data.durationMinutes || 30; // Default to 30 minutes if not set
    chrome.alarms.create(ALARM_NAME, {
      delayInMinutes: minutes,
    });
    chrome.storage.local.set({ timerStart: Date.now() });
  });
}

function resetTimer() {
  chrome.alarms.clear(ALARM_NAME, () => {
    startTimer();
  });
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "images/icon-48.png",
      title: "Время!",
      message: "Вы смотрите YouTube уже долго. Сделайте перерыв!",
      priority: 2,
    });

    chrome.tabs.query({ url: "*://www.youtube.com/*" }, (tabs) => {
      for (let tab of tabs) {
        chrome.tabs
          .sendMessage(tab.id, { action: "showPageNotification" })
          .catch((error) => {
            // works fine, so ignore the case where the content script is not injected
          });
      }
    });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["timerStart", "durationMinutes"], (data) => {
    if (!data.timerStart) {
      startTimer();
    }
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "resetTimer") {
    resetTimer();
    sendResponse({ status: "ok" });
  } else if (request.action === "getTimeLeft") {
    chrome.storage.local.get(["timerStart", "durationMinutes"], (data) => {
      const start = data.timerStart || 0;
      const duration = (data.durationMinutes || 30) * 60 * 1000; // Default to 30 minutes in milliseconds
      const elapsed = Date.now() - start;
      const timeLeftMs = Math.max(0, duration - elapsed);
      sendResponse({ timeLeftMs });
    });
    return true; // Keep the message channel open for sendResponse
  } else if (request.action === "setDuration") {
    chrome.storage.local.set({ durationMinutes: request.minutes }, () => {
      resetTimer();
      sendResponse({ status: "ok" });
    });
    return true; // Keep the message channel open for sendResponse
  }
});
