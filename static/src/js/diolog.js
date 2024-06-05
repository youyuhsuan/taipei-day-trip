const openDialogButton = document.querySelector(".open-dialog");
const closeDialogButton = document.querySelectorAll(".close-dialog");
const signinDialog = document.querySelector(".signin-dialog");
const signupDialog = document.querySelector(".signup-dialog");

const signupLink = document.querySelector(".signup-link");
const signinLink = document.querySelector(".signin-link");

openDialogButton.addEventListener("click", () => {
  signinDialog.showModal();
});

closeDialogButton.forEach((button) => {
  button.addEventListener("click", () => {
    signinDialog.close();
    signupDialog.close();
  });
});

signupLink.addEventListener("click", () => {
  signinDialog.close();
  signupDialog.showModal();
});

signinLink.addEventListener("click", () => {
  signupDialog.close();
  signinDialog.showModal();
});
