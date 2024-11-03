import { booking } from "../variables.js";
import { token } from "../variables.js";

async function bookingDeleteApi(shouldReload = false) {
  try {
    const response = await fetch("/api/booking", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response) {
      booking.remove();
      if (shouldReload) {
        location.reload();
      }
    }
  } catch (error) {
    console.error("bookingDeleteApi error:", error);
  }
}

export { bookingDeleteApi };
