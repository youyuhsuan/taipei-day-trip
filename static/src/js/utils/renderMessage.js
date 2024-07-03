import { removePreviousMessage } from "./removePreviousMessage.js";

function renderAuthMessage(message, form, anchorElement) {
  let messageSpan = document.createElement("span");
  messageSpan.className = "error-message";
  removePreviousMessage();
  if (message === "註冊成功") {
    messageSpan.className = "success-message";
  }
  messageSpan.textContent = message;
  form.insertBefore(messageSpan, anchorElement);
}

function renderContactMessage(message, form, anchorElement) {
  let messageSpan = document.createElement("span");
  messageSpan.className = "error-message";
  removePreviousMessage();
  messageSpan.textContent = message;
  form.insertBefore(messageSpan, anchorElement);
}

export { renderAuthMessage, renderContactMessage };
