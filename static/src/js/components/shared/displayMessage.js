function displayMessage(message, form, anchorElement) {
  removePreviousMessage();
  let errorMessage = document.createElement("span");
  errorMessage.className = "error-message";
  errorMessage.textContent = message;
  form.insertBefore(errorMessage, anchorElement);
}
