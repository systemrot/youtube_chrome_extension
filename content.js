if (!window.youtubeReminderInitialized) {
  window.youtubeReminderInitialized = true;

  let notificationEl;
  let overlayEl;
  let shouldShowNotificationAfterFullscreen;

  function createNotificationElement() {
    overlayEl = document.createElement("div");
    overlayEl.style.position = "fixed";
    overlayEl.style.top = "0";
    overlayEl.style.left = "0";
    overlayEl.style.width = "220vw";
    overlayEl.style.height = "100vh";
    overlayEl.style.backgroundColor = "rgba(0, 0, 0, 0.95)";
    overlayEl.style.zIndex = "999998";
    overlayEl.style.display = "none";

    document.body.appendChild(overlayEl);

    notificationEl = document.createElement("div");
    notificationEl.style.position = "fixed";
    notificationEl.style.top = "50%";
    notificationEl.style.left = "50%";
    notificationEl.style.transform = "translate(-50%)";
    notificationEl.style.padding = "2vh 4vw";
    notificationEl.style.backgroundColor = "rgba(255, 69, 0, 0.95)";
    notificationEl.style.color = "white";
    notificationEl.style.fontSize = "2.2vh";
    notificationEl.style.fontWeight = "bold";
    notificationEl.style.borderRadius = "1.1vh";
    notificationEl.style.zIndex = "999999";
    notificationEl.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.3)";
    notificationEl.style.cursor = "pointer";
    notificationEl.style.userSelect = "none";
    notificationEl.style.display = "none";
    notificationEl.style.textAlign = "center";
    notificationEl.style.whiteSpace = "break-spaces";
    notificationEl.textContent =
      "Вы смотрите YouTube уже долго. Сделайте перерыв!";

    notificationEl.addEventListener("click", () => {
      overlayEl.style.display = "none";
      notificationEl.style.display = "none";
      shouldShowNotificationAfterFullscreen = false;
    });

    document.body.appendChild(notificationEl);
  }

  function showPageNotification() {
    if (!notificationEl) {
      createNotificationElement();
    }

    overlayEl.style.display = "block";
    notificationEl.style.display = "block";

    setTimeout(() => {
      notificationEl.style.display = "none";
      overlayEl.style.display = "none";
    }, 8000);
  }

  document.addEventListener("fullscreenchange", () => {
    const isFullscreen = !!document.fullscreenElement;

    if (!isFullscreen && shouldShowNotificationAfterFullscreen) {
      showPageNotification();
      shouldShowNotificationAfterFullscreen = false;
    }
  });

  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "showPageNotification") {
      if (document.fullscreenElement) {
        shouldShowNotificationAfterFullscreen = true;
      } else {
        showPageNotification();
      }
    }
  });
}
