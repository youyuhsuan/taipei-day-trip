const bookingData = JSON.parse(sessionStorage.getItem("bookingData"));
const orderData = JSON.parse(sessionStorage.getItem("orderData"));

const number = document.querySelector(".thankyou-number");
number.textContent = `訂單編號：${orderData.number}`;
const message = document.querySelector(".thankyou-message");
message.textContent = `訂單資訊：${orderData.payment.message}`;
const image = document.querySelector(".thankyou-image");
const img = image.querySelector("img");
img.src = bookingData.attraction.image;
img.alt = bookingData.attraction.name;
img.setAttribute("loading", "lazy");

const name = document.querySelector(".thankyou-name");
name.textContent = `訂單名稱：${bookingData.attraction.name}`;
const date = document.querySelector(".thankyou-date");
date.textContent = `訂單日期：${bookingData.date}`;
const price = document.querySelector(".thankyou-price");
price.textContent = `訂單價格：${bookingData.price}`;
const time = document.querySelector(".thankyou-time");
time.textContent = `預約時間：${bookingData.time}`;
const address = document.querySelector(".thankyou-address");
address.textContent = `景點地址：${bookingData.attraction.address}`;
