import {
  displayMessage,
  removePreviousMessage,
} from "../shared/displayMessage";
import { signinData } from "../services/authService";

const signinForm = document.querySelector(".signin-form");
const signupLink = signinForm.querySelector(".signup-link");

signinForm.addEventListener("submit", async function (event) {
  let signinEmail = document.getElementById("signin-email").value.trim();
  let signinPassword = document.getElementById("signin-password").value.trim();
  event.preventDefault();
  removePreviousMessage();
  if (signinEmail === "" || signinPassword === "") {
    displayMessage("帳號或密碼不能為空值", signinForm, signupLink);
    return;
  }
  await signinData(signinEmail, signinPassword);
});

export { signinForm, signupLink };
