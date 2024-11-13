import { token, booking } from "../variables.js";
import { createBookingInfo } from "../components/createBookingInfo.js";
import { switchLogoutAndRedirect } from "../utils/switchLogout.js";
import { initFooterMonitor } from "../events/initFooterMonitor.js";

let bookInfo = document.querySelector(".book-info");
let bookingEmail = document.getElementById("booking-email");
let bookingName = document.getElementById("booking-name");
let userName = document.querySelector(".user");

let bookingData = null;

// 更新用戶信息
function updateUserInfo(name, email) {
  if (bookingEmail) bookingEmail.value = email;
  if (bookingName) bookingName.value = name;
  if (userName) userName.textContent = name;
}

// 顯示預訂信息
function displayBookingInfo(data) {
  const {
    attraction: { name, address, image },
    date,
    time,
    price,
  } = data;

  bookInfo?.classList.toggle("active");
  createBookingInfo(name, address, image, date, time, price);
  initFooterMonitor();
}

// 顯示空預訂信息
function displayEmptyBooking() {
  const bookingContent = document.createElement("div");
  bookingContent.className = "booking-info";
  bookingContent.textContent = "目前沒有任何預約的行程";

  booking?.appendChild(bookingContent);
  initFooterMonitor();
}

// 獲取預訂數據
async function fetchBookingData() {
  const response = await fetch("/api/booking", {
    method: "GET",
    headers: {
      ..."application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// 處理預訂數據
async function bookingGetApi() {
  try {
    const responseData = await fetchBookingData();

    if (responseData?.data) {
      bookingData = responseData.data;
      displayBookingInfo(responseData.data);
      return responseData.data;
    }

    if (responseData?.error) {
      switchLogoutAndRedirect();
      return;
    }

    displayEmptyBooking();
  } catch (error) {
    console.error("Failed to fetch booking get Api error: ", error);
  }
}

// Token 回調處理
window.tokenDataCallBack = function (tokenData) {
  const { name, email } = tokenData.data || {};
  console.log(name, email);
  if (name && email) {
    updateUserInfo(name, email);
  }
};

function getBookingData() {
  return bookingData;
}

export { bookingGetApi, getBookingData };
