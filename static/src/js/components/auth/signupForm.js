import {
  displayMessage,
  removePreviousMessage,
} from "../shared/displayMessage";
import { signupData } from "../../services/authService";

const signupForm = document.querySelector(".signup-form");
const signinLink = signupForm.querySelector(".signin-link");

signupForm.addEventListener("submit", async function (event) {
  let signupName = document.getElementById("signup-name").value.trim();
  let signupEmail = document.getElementById("signup-email").value.trim();
  let signupPassword = document.getElementById("signup-password").value.trim();
  event.preventDefault();
  removePreviousMessage();
  if (signupName === "" || signupEmail === "" || signupPassword === "") {
    displayMessage("姓名, 電子郵件或密碼不能為空值", signupForm, signinLink);
    return;
  }
  await signupData(signupName, signupEmail, signupPassword);
});

export { signupForm, signinLink };
