import {
  openSigninDialog,
  closeSigninDialog,
} from "./components/auth/signinDialog";
import {
  openSignupDialog,
  closeSignupDialog,
} from "./components/auth/signinDialog";
import {
  updateAuthButton,
  handleLogout,
} from "./components/shared/updateAuthButton";

const openDialogButton = document.querySelector(".open-dialog");
const closeDialogButton = document.querySelectorAll(".close-dialog");
const signinLink = document.querySelector(".signin-link");
const signupLink = document.querySelector(".signup-link");

openDialogButton.addEventListener("click", openSigninDialog);

closeDialogButton.forEach((button) => {
  button.addEventListener("click", () => {
    closeSigninDialog();
    closeSignupDialog();
  });
});

signupLink.addEventListener("click", () => {
  closeSigninDialog();
  openSignupDialog();
});

signinLink.addEventListener("click", () => {
  closeSignupDialog();
  openSigninDialog();
});

document.addEventListener("DOMContentLoaded", async function () {
  updateAuthButton();
  let logoutBtn = document.querySelector(".logout-btn");
  logoutBtn.addEventListener("click", handleLogout);
});
