import { token, booking } from "../variables.js";
import { creatBookingInfo } from "../components/creatBookingInfo.js";
// import { renderUser } from "../page/renderUser.js";
// import { glbalToken } from "../utils/bookingHandleLogout.js";

let bookInfo = document.querySelector(".book-info");
let bookingEmail = document.getElementById("booking-email");
let bookingName = document.getElementById("booking-name");
let userName = document.querySelector(".user");

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
    const responseData = await response.json();
    if (responseData) {
      let data = responseData.data;
      let name = data.attraction.name;
      let address = data.attraction.address;
      let image = data.attraction.image;
      let date = data.date;
      let time = data.time;
      let price = data.price;
      bookInfo.classList.toggle("active");
      creatBookingInfo(name, address, image, date, time, price);
    } else {
      let bookingContent = document.createElement("div");
      bookingContent.className = "booking-info";
      bookingContent.textContent = "目前沒有任何預約的行稱";
      booking.appendChild(bookingContent);
    }
  } catch (error) {
    console.error("bookingGetApi error:", error);
  }
}

bookingGetApi();

export { bookingGetApi };