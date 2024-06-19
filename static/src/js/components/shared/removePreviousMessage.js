function removePreviousMessage() {
  let previousMessages = document.querySelectorAll(".error-message");
  previousMessages.forEach(function (message) {
    message.remove();
  });
}
