import { onSubmit, getPrime } from "../components/tappay.js";
import { orderPostApi } from "../api/ordersPostApi.js";

const submitButton = document.querySelector(".confirm-btn");

submitButton.addEventListener("click", async (event) => {
  try {
    const bookingName = document.getElementById("booking-name").value.trim();
    const bookingEmail = document.getElementById("booking-email").value.trim();
    const bookingPhone = document.getElementById("booking-phone").value.trim();
    if (!bookingName) {
      showError("姓名");
    }
    if (!bookingEmail) {
      showError("電子郵件");
    }
    if (!bookingPhone) {
      showError("手機號碼");
    }
    await onSubmit(event);
    orderPostApi(bookingName, bookingEmail, bookingPhone);
  } catch (error) {
    console.error("submitButton Prime", error);
    // alert(error.message);
  }
});

function showError(message) {
  alert(`${message}不能為空`);
  return;
}
