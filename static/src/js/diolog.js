const openDialogButton = document.querySelector(".open-dialog");
const closeDialogButton = document.querySelector(".close-dialog");
const signinDialog = document.querySelector(".signin-dialog");

openDialogButton.addEventListener("click", () => {
  signinDialog.showModal();
});

closeDialogButton.addEventListener("click", () => {
  signinDialog.close();
});
