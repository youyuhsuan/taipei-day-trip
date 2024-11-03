import { token, signinDialog } from "../variables.js";

const bookingBtn = document.querySelector(".booking-btn");

bookingBtn.addEventListener("click", () => {
  if (!token) {
    signinDialog.showModal();
  } else {
    window.location.href = "/booking";
  }
});
