import { removePreviousMessage } from "../shared/removePreviousMessage.js";

export function displayMessage(message, form, anchorElement) {
  let messageSpan = document.createElement("span");
  messageSpan.className = "error-message";
  removePreviousMessage();
  if (message === "註冊成功") {
    messageSpan.className = "success-message";
  }
  messageSpan.textContent = message;
  form.insertBefore(messageSpan, anchorElement);
}
