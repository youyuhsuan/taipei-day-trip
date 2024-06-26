const booking = document.querySelector(".booking");

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

  let bookingName = document.createElement("span");
  bookingName.className = "booking-name";
  bookingName.textContent = name;

  let bookingDate = document.createElement("span");
  bookingDate.className = "booking-date";
  bookingDate.textContent = date;

  let bookingTime = document.createElement("span");
  bookingTime.className = "booking-time";
  bookingTime.textContent =
    time === "afternoon" ? "下午2點至晚上8點" : "上午9點至中午12點";

  let bookingPrice = document.createElement("span");
  bookingPrice.className = "booking-price";
  bookingPrice.textContent = "新台幣" + price + "元";

  let bookingAddress = document.createElement("span");
  bookingAddress.className = "booking-address";
  bookingAddress.textContent = address;

  booking.appendChild(bookingImage);
  bookingImage.appendChild(img);
  booking.appendChild(bookingContent);
  bookingContent.appendChild(bookingName);
  bookingContent.appendChild(bookingInfo);

  bookingInfo.appendChild(bookingDate);
  bookingInfo.appendChild(bookingTime);
  bookingInfo.appendChild(bookingPrice);
  bookingInfo.appendChild(bookingAddress);
}

export { creatBookingInfo };
