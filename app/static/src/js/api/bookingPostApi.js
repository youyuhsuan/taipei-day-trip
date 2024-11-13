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
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    window.location.href = "/booking";
  } catch (error) {
    signinDialog.showModal();
    console.error("Failed to fetch booking post API error: ", error);
    throw error;
  }
}

export { bookingPostApi };
