import { token, signinDialog } from "../variables.js";
import { glbalToken } from "./userAuthGetApi.js";

async function bookingPostApi(attractionId, date, time, price) {
  if (glbalToken === null) {
    signinDialog.showModal();
    return;
  }
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
    signinDialog.showModal();

    console.error("bookingPostApi error:", e);
  }
}

export { bookingPostApi };
