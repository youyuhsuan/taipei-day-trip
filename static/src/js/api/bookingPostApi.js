import { token } from "../variables.js";

async function bookingPostApi(attractionId, date, time, price) {
  try {
    const response = await fetch("/api/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        attractionId: attractionId,
        date: date,
        time: time,
        price: price,
      }),
    });
    if (response.ok) {
      window.location.href = "/booking";
    }
  } catch (e) {
    console.error("bookingPostApi error:", e);
  }
}

export { bookingPostApi };
