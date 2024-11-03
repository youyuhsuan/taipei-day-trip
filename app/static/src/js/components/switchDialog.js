import {
  signinDialog,
  signupDialog,
  signinForm,
  signupLink,
  signupForm,
  signinLink,
} from "../variables.js";

import { removePreviousMessage } from "../utils/removePreviousMessage.js";

const openDialogButton = document.querySelector(".open-dialog");
const closeDialogButton = document.querySelectorAll(".close-dialog");

openDialogButton.addEventListener("click", () => {
  signinDialog.showModal();
});

closeDialogButton.forEach((button) => {
  button.addEventListener("click", () => {
    signinForm.reset();
    signupForm.reset();
    removePreviousMessage();
    signinDialog.close();
    signupDialog.close();
  });
});

signupLink.addEventListener("click", () => {
  signinForm.reset();
  removePreviousMessage();
  signinDialog.close();
  signupDialog.showModal();
});

signinLink.addEventListener("click", () => {
  signupForm.reset();
  removePreviousMessage();
  signupDialog.close();
  signinDialog.showModal();
});
