import { signinForm, signupLink, removePreviousMessage } from "signinForm";

const signinDialog = document.querySelector(".signin-dialog");

export function openSigninDialog() {
  signinDialog.showModal();
}

export function closeSigninDialog() {
  signinForm.reset();
  removePreviousMessage();
  signinDialog.close();
}
