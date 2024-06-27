import { glbalToken } from "../utils/bookingHandleLogout.js";

console.log("glbalToken", glbalToken);
let bookingName = document.getElementById("booking-name");
let bookingEmail = document.getElementById("booking-email");

function renderUser() {
  bookingName.value = glbalToken;
}

export { renderUser };
