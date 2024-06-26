import { booking } from "../variables.js";

function creatBookingInfo(name, address, image, date, time, price) {
  let bookingImage = document.createElement("div");
  bookingImage.className = "booking-image";

  let img = document.createElement("img");
  img.src = image;
  img.alt = name;
  img.setAttribute("loading", "lazy");

  let bookingContent = document.createElement("div");
  bookingContent.className = "booking-content";

  let bookingInfo = document.createElement("div");
  bookingInfo.className = "booking-info";

  let bookingName = document.createElement("div");
  bookingName.className = "booking-name";

  let titleName = document.createElement("span");
  titleName.className = "title-name";
  titleName.textContent = "台北一日遊：";

  let infoName = document.createElement("span");
  infoName.className = "info-name";
  infoName.textContent = name;

  let bookingDate = document.createElement("div");
  bookingDate.className = "booking-date";

  let titleDate = document.createElement("span");
  titleDate.className = "title-date";
  titleDate.textContent = "日期：";

  let infoDate = document.createElement("span");
  infoDate.className = "info-date";
  infoDate.textContent = date;

  let bookingTime = document.createElement("div");
  bookingTime.className = "booking-time";

  let titleTime = document.createElement("span");
  titleTime.className = "title-time";
  titleTime.textContent = "時間：";

  let infoTime = document.createElement("span");
  infoTime.className = "info-time";
  infoTime.textContent =
    time === "afternoon" ? "下午2點至晚上8點" : "上午9點至中午12點";

  let bookingPrice = document.createElement("div");
  bookingPrice.className = "booking-price";

  let titlePrice = document.createElement("span");
  titlePrice.className = "title-price";
  titlePrice.textContent = "費用：";

  let infoPrice = document.createElement("span");
  infoPrice.className = "booking-price";
  infoPrice.textContent = "新台幣" + price + "元";

  let bookingAddress = document.createElement("div");
  bookingAddress.className = "booking-price";

  let titleAddress = document.createElement("span");
  titleAddress.className = "title-address";
  titleAddress.textContent = "地址：";

  let infoAddress = document.createElement("span");
  infoAddress.className = "booking-address";
  infoAddress.textContent = address;

  booking.appendChild(bookingImage);
  bookingImage.appendChild(img);

  booking.appendChild(bookingContent);
  bookingContent.appendChild(bookingName);
  bookingContent.appendChild(bookingInfo);

  bookingName.appendChild(titleName);
  bookingName.appendChild(infoName);

  bookingInfo.appendChild(bookingDate);
  bookingDate.appendChild(titleDate);
  bookingDate.appendChild(infoDate);

  bookingInfo.appendChild(bookingTime);
  bookingTime.appendChild(titleTime);
  bookingTime.appendChild(infoTime);

  bookingInfo.appendChild(bookingPrice);
  bookingPrice.appendChild(titlePrice);
  bookingPrice.appendChild(infoPrice);

  bookingInfo.appendChild(bookingAddress);
  bookingAddress.appendChild(titleAddress);
  bookingAddress.appendChild(infoAddress);
}

export { creatBookingInfo };
