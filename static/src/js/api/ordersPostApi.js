import { getPrime } from "../components/tappay.js";
import { getBookingData } from "../api/bookingGetApi.js";
import { bookingDeleteApi } from "../api/bookingDeleteApi.js";
import { token } from "../variables.js";

async function orderPostApi(bookingName, bookingEmail, bookingPhone) {
  const bookingData = getBookingData();
  const prime = await getPrime();
  console.log(bookingData, prime);
  if (!bookingData) {
    throw new Error("Booking data is not available");
  }

  if (!prime) {
    throw new Error("Failed to generate Prime");
  }
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        prime: prime,
        order: {
          price: bookingData.price,
          trip: {
            attraction: {
              id: bookingData.attraction.id,
              name: bookingData.attraction.name,
              address: bookingData.attraction.address,
              image: bookingData.attraction.image,
            },
            date: bookingData.date,
            time: bookingData.time,
          },
          contact: {
            name: bookingName,
            email: bookingEmail,
            phone: bookingPhone,
          },
        },
      }),
    });
    if (response.ok || response.status === 400) {
      const responseData = await response.json();
      bookingDeleteApi(false);
      sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
      sessionStorage.setItem("orderData", JSON.stringify(responseData.data));
      window.location.href = `/thankyou?number=${responseData.data.number}`;
    }
  } catch (e) {
    console.error("orderPostApi error:", e);
  }
}

export { orderPostApi };
