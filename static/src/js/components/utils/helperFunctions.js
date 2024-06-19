function displayMessage(message, form, anchorElement) {
  removePreviousMessage();
  let errorMessage = document.createElement("span");
  errorMessage.className = "error-message";
  errorMessage.textContent = message;
  form.insertBefore(errorMessage, anchorElement);
}

function removePreviousMessage() {
  let previousMessages = document.querySelectorAll(".error-message");
  previousMessages.forEach(function (message) {
    message.remove();
  });
}

export { displayMessage, removePreviousMessage };
