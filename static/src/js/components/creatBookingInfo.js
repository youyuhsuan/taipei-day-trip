import { booking } from "../variables.js";
import { bookingDeleteApi } from "../api/bookingDeleteApi.js";

let totalPrice = document.querySelector(".total-price");

async function creatBookingInfo(name, address, image, date, time, price) {
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

  let deleteIcon = document.createElement("i");
  deleteIcon.className = "delete-icon";

  let icon = document.createElement("img");
  icon.src = "static/src/image/icon/delete.png";

  let titleName = document.createElement("span");
  titleName.className = "title-name bold";
  titleName.textContent = "台北一日遊：";

  let infoName = document.createElement("span");
  infoName.className = "info-name bold";
  infoName.textContent = name;

  let bookingDate = document.createElement("div");
  bookingDate.className = "booking-date";

  let titleDate = document.createElement("span");
  titleDate.className = "title-date bold";
  titleDate.textContent = "日期：";

  let infoDate = document.createElement("span");
  infoDate.className = "info-date";
  infoDate.textContent = date;

  let bookingTime = document.createElement("div");
  bookingTime.className = "booking-time";

  let titleTime = document.createElement("span");
  titleTime.className = "title-time bold";
  titleTime.textContent = "時間：";

  let infoTime = document.createElement("span");
  infoTime.className = "info-time";
  infoTime.textContent =
    time === "afternoon" ? "下午2點至晚上8點" : "上午9點至中午12點";

  let bookingPrice = document.createElement("div");
  bookingPrice.className = "booking-price";

  let titlePrice = document.createElement("span");
  titlePrice.className = "title-price bold";
  titlePrice.textContent = "費用：";

  let infoPrice = document.createElement("span");
  infoPrice.className = "booking-price";
  infoPrice.textContent = `新台幣${price}元`;

  let bookingAddress = document.createElement("div");
  bookingAddress.className = "booking-price";

  let titleAddress = document.createElement("span");
  titleAddress.className = "title-address bold";
  titleAddress.textContent = "地址：";

  let infoAddress = document.createElement("span");
  infoAddress.className = "booking-address";
  infoAddress.textContent = address;

  let hr = document.createElement("hr");

  let contact = document.createElement("section");
  contact.className = "contact";

  let contactTitle = document.createElement("div");
  contactTitle.className = "contact-title font-btn bold";
  contactTitle.textContent = "您的聯絡資訊";

  let contactForm = document.createElement("form");
  contactForm.className = "contact-form";

  let formGroup = document.createElement("div");
  formGroup.className = "formGroup";

  let bookNameLabel = document.createElement("label");
  bookNameLabel.setAttribute("for", "book-name");
  bookNameLabel.className = "medium font-body";
  bookNameLabel.textContent = "聯絡姓名：";

  let bookNameInput = document.createElement("input");
  bookNameInput.setAttribute("type", "text");
  bookNameInput.setAttribute("name", "name");
  bookNameInput.setAttribute("id", "book-name");
  bookNameInput.setAttribute("autocomplete", "name");
  bookNameInput.setAttribute("placeholder", "輸入姓名");
  bookNameInput.setAttribute("required", "");

  let bookEmailLabel = document.createElement("label");
  bookEmailLabel.setAttribute("for", "book-email");
  bookEmailLabel.className = "medium font-body";
  bookEmailLabel.textContent = "連絡信箱：";

  let bookEmailInput = document.createElement("input");
  bookEmailInput.setAttribute("type", "email");
  bookEmailInput.setAttribute("name", "email");
  bookEmailInput.setAttribute("id", "book-email");
  bookEmailInput.setAttribute("autocomplete", "email");
  bookEmailInput.setAttribute("placeholder", "輸入電子郵件");
  bookEmailInput.setAttribute("required", "");

  let bookPhoneLabel = document.createElement("label");
  bookPhoneLabel.setAttribute("for", "book-phone");
  bookPhoneLabel.className = "medium font-body";
  bookPhoneLabel.textContent = "連絡信箱：";

  let bookPhoneInput = document.createElement("input");
  bookPhoneInput.setAttribute("type", "phone");
  bookPhoneInput.setAttribute("name", "phone");
  bookPhoneInput.setAttribute("id", "book-phone");
  bookPhoneInput.setAttribute("autocomplete", "phone");
  bookPhoneInput.setAttribute("placeholder", "輸入手機號碼");
  bookPhoneInput.setAttribute("required", "");

  let note = document.createElement("p");
  note.className = "note font-body bold";
  note.textContent =
    "請保持手機暢通，準時到達，導覽人員將用手機與您聯繫，務必留下正確的聯絡方式。";

  totalPrice.textContent = `總價：新台幣 ${price} 元`;
  booking.appendChild(bookingImage);
  bookingImage.appendChild(img);

  booking.appendChild(bookingContent);
  bookingContent.appendChild(bookingName);
  bookingContent.appendChild(bookingInfo);

  bookingName.appendChild(titleName);
  bookingName.appendChild(infoName);

  bookingContent.appendChild(deleteIcon);
  deleteIcon.appendChild(icon);

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

  deleteIcon.addEventListener("click", async function () {
    bookingDeleteApi();
  });
}

export { creatBookingInfo };
