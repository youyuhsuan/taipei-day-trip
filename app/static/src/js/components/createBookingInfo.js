import { booking } from "../variables.js";
import { bookingDeleteApi } from "../api/bookingDeleteApi.js";
const totalPrice = document.querySelector(".total-price");

function createElementWithClass(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

function createInfoElement(titleText, infoText, className) {
  const container = createElementWithClass("div", className);
  const title = createElementWithClass("span", `title-${className} bold`);
  title.textContent = titleText;
  const info = createElementWithClass("span", `info-${className}`);
  info.textContent = infoText;
  container.append(title, info);
  return container;
}

async function createBookingInfo(name, address, image, date, time, price) {
  const bookingImage = createElementWithClass("div", "booking-image");
  const img = document.createElement("img");
  Object.assign(img, { src: image, alt: name, loading: "lazy" });
  bookingImage.appendChild(img);

  const bookingContent = createElementWithClass("div", "booking-content");
  const bookingInfo = createElementWithClass("div", "booking-info");

  const bookingName = createInfoElement("台北一日遊：", name, "booking-name");

  const deleteIcon = createElementWithClass("i", "delete-icon");
  const icon = document.createElement("img");
  icon.src = "static/src/image/icon/delete.png";
  deleteIcon.appendChild(icon);
  deleteIcon.addEventListener("click", () => bookingDeleteApi(true));

  const timeText =
    time === "afternoon" ? "下午2點至晚上8點" : "上午9點至中午12點";

  bookingInfo.append(
    createInfoElement("日期：", date, "booking-date"),
    createInfoElement("時間：", timeText, "booking-time"),
    createInfoElement("費用：", `新台幣${price}元`, "booking-price"),
    createInfoElement("地址：", address, "booking-address")
  );

  bookingContent.append(bookingName, deleteIcon, bookingInfo);

  totalPrice.textContent = `總價：新台幣 ${price} 元`;
  booking.append(bookingImage, bookingContent);
}

export { createBookingInfo };
