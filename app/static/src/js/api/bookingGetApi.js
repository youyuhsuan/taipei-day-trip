import { token, booking } from "../variables.js";
import { createBookingInfo } from "../components/createBookingInfo.js";
import { switchLogoutAndRedirect } from "../utils/switchLogout.js";

let bookInfo = document.querySelector(".book-info");
let bookingEmail = document.getElementById("booking-email");
let bookingName = document.getElementById("booking-name");
let userName = document.querySelector(".user");

let bookingData = null;

window.tokenDataCallBack = function (tokenData) {
  let name = tokenData["data"]["name"];
  let email = tokenData["data"]["email"];
  user(name, email);
};

function user(name, email) {
  bookingEmail.value = email;
  bookingName.value = name;
  userName.textContent = name;
}

async function bookingGetApi() {
  try {
    const response = await fetch("/api/booking", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response);
    const responseData = await response.json();
    if (responseData && responseData.data) {
      bookingData = responseData.data;
      let data = responseData.data;
      let name = data.attraction.name;
      let address = data.attraction.address;
      let image = data.attraction.image;
      let date = data.date;
      let time = data.time;
      let price = data.price;
      bookInfo.classList.toggle("active");
      createBookingInfo(name, address, image, date, time, price);
      return bookingData;
    } else if (responseData && responseData.error) {
      switchLogoutAndRedirect();
    } else {
      let bookingContent = document.createElement("div");
      bookingContent.className = "booking-info";
      bookingContent.textContent = "目前沒有任何預約的行程";
      booking.appendChild(bookingContent);
      let footer = document.querySelector("footer");
      footer.classList.add("booking-footer");
    }
  } catch (error) {
    console.error("bookingGetApi error:", error);
  }
}

function getBookingData() {
  return bookingData;
}

bookingGetApi();

export { bookingGetApi, getBookingData };
