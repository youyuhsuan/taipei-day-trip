import { bookingPostApi } from "../api/bookingPostApi.js";
import { getCookie } from "../utils/getCookie.js";

let attractionId = getCookie("selectedAttractionId");
const bookingForm = document.querySelector(".booking-form");

bookingForm.addEventListener("submit", async function (event) {
  let date = document.getElementById("date").value;
  let time = document.querySelector('input[name="time"]:checked').value;
  const price = document
    .querySelector(".price-amount")
    .getAttribute("data-price");

  event.preventDefault();
  if (!attractionId) {
    console.error("Attraction ID not found in localStorage.");
    event.preventDefault();
    return;
  }

  if (!date || !time) {
    console.error("Please select date and time.");
    return;
  }

  await bookingPostApi(attractionId, date, time, price);
});
