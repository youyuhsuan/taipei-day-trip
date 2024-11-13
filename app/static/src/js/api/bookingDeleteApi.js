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
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (response) {
      booking.remove();
      if (shouldReload) {
        location.reload();
      }
    }
  } catch (error) {
    console.error("Failed to fetch booking delete Api error: ", error);
    throw error;
  }
}

export { bookingDeleteApi };
