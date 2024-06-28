const bookingForm = document.querySelector(".booking-form");
const morning = document.getElementById("morning");
const afternoon = document.getElementById("afternoon");
const price = bookingForm.querySelector(".price");
const priceAmount = price.querySelector(".price-amount");

function updatePrice(price) {
  priceAmount.setAttribute("data-price", price);
  priceAmount.textContent = price.toLocaleString();
}

function setPrice() {
  updatePrice(2000);

  morning.addEventListener("click", () => {
    updatePrice(2000);
  });

  afternoon.addEventListener("click", () => {
    updatePrice(2500);
  });
}

document.addEventListener("DOMContentLoaded", setPrice);

export { setPrice };
