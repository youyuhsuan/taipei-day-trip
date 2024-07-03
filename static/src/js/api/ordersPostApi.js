import { getPrime } from "../components/tappay.js";
import { getBookingData } from "../api/bookingGetApi.js";
import { token } from "../variables.js";

async function orderPostApi(bookingName, bookingEmail, bookingPhone) {
  const bookingData = getBookingData();
  const prime = await getPrime();
  console.log(bookingData, prime);
  if (!bookingData) {
    throw new Error("bookingData 尚未生成");
  }
  if (!prime) {
    throw new Error("Prime 尚未生成");
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
    if (response.ok) {
      console.log("ok");
    } else {
    }
  } catch (e) {}
}

export { orderPostApi };
