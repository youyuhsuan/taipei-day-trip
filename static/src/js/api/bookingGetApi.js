import { token } from "../variables.js";
import { creatBookingInfo } from "../components/creatBookingInfo.js";

async function bookingGetApi() {
  try {
    const response = await fetch("/api/booking", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const responseData = await response.json();
    let data = responseData.data;
    let name = data.attraction.name;
    let address = data.attraction.address;
    let image = data.attraction.image;
    let date = data.date;
    let time = data.time;
    let price = data.price;
    creatBookingInfo(name, address, image, date, time, price);
  } catch (error) {
    console.error("bookingGetApi error:", error);
  }
}

bookingGetApi();

export { bookingGetApi };
