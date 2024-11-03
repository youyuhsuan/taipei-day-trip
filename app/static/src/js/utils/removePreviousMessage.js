function removePreviousMessage() {
  let errorMessages = document.querySelectorAll(".error-message");
  let successMessages = document.querySelectorAll(".success-message");
  errorMessages.forEach(function (message) {
    message.remove();
  });
  successMessages.forEach(function (message) {
    message.remove();
  });
}

export { removePreviousMessage };
