const bookingForm = document.querySelector(".booking-form");
const morning = document.getElementById("morning");
const afternoon = document.getElementById("afternoon");
const price = bookingForm.querySelector(".price");
const priceAmount = price.querySelector(".price-amount");

function radio() {
  priceAmount.textContent = "新台幣 2000元";

  morning.addEventListener("click", () => {
    priceAmount.textContent = "新台幣 2000元";
  });

  afternoon.addEventListener("click", () => {
    priceAmount.textContent = "新台幣 2500元";
  });
}

export { radio };
