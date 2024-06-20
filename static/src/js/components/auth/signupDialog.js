import { signupForm, signinLink, removePreviousMessage } from "signupForm";

const signupDialog = document.querySelector(".signup-dialog");

export function openSignupDialog() {
  signupDialog.showModal();
}

export function closeSignupDialog() {
  signupForm.reset();
  removePreviousMessage();
  signupDialog.close();
}
