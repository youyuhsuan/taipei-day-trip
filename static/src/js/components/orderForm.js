import { onSubmit, getPrime } from "../components/tappay.js";
import { orderPostApi } from "../api/ordersPostApi.js";

const submitButton = document.querySelector(".confirm-btn");

submitButton.addEventListener("click", async (event) => {
  try {
    const bookingName = document.getElementById("booking-name").value.trim();
    const bookingEmail = document.getElementById("booking-email").value.trim();
    const bookingPhone = document.getElementById("booking-phone").value.trim();
    console.log(bookingName, bookingEmail, bookingPhone);
    if (!bookingName || !bookingEmail || !bookingPhone) {
      console.error("Please fill in all required fields.");
      return;
    }
    await onSubmit(event);
    console.log("Prime 已更新:", getPrime());
    orderPostApi(bookingName, bookingEmail, bookingPhone);
  } catch (error) {
    console.error("獲取 Prime 失敗:", error);
    alert(error.message);
  }
});
