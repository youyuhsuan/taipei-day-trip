import {
  signinForm,
  signupLink,
  signupForm,
  signinLink,
} from "../variables.js";
import { removePreviousMessage } from "../utils/removePreviousMessage.js";
import { displayMessage } from "../utils/displayMessage.js";
import { signinData, signupData } from "../api/authApi.js";

// TODO:密碼格式不正確
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

signinForm.addEventListener("submit", async function (event) {
  let signinEmail = document.getElementById("signin-email").value.trim();
  let signinPassword = document.getElementById("signin-password").value.trim();
  event.preventDefault();
  removePreviousMessage();

  if (signinEmail === "" || signinPassword === "") {
    displayMessage("帳號或密碼不能為空值", signinForm, signupLink);
    return;
  }

  if (!emailRegex.test(signinEmail)) {
    displayMessage("帳號格式不正確", signinForm, signupLink);
    return;
  }
  // if (!passwordRegex.test(signinPassword)) {
  //   displayMessage("密碼格式不正確", signinForm, signupLink);
  //   return;
  // }

  await signinData(signinEmail, signinPassword);
});

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

  if (!emailRegex.test(signupEmail)) {
    displayMessage("帳號格式不正確", signinForm, signupLink);
    return;
  }
  // if (!passwordRegex.test(signinPassword)) {
  //   displayMessage("密碼格式不正確", signinForm, signupLink);
  //   return;
  // }

  await signupData(signupName, signupEmail, signupPassword);
});
