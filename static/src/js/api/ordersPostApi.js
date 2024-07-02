import { getPrime } from "../components/tappay.js";
import { getBookingData } from "../api/bookingGetApi.js";

async function orderPostApi() {
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
          price: price,
          trip: {
            attraction: {
              id: 10,
              name: name,
              address: address,
              image: image,
            },
            date: date,
            time: time,
          },
          contact: {
            name: "彭彭彭",
            email: "ply@ply.com",
            phone: "0912345678",
          },
        },
      }),
    });
    if (response.ok) {
    } else {
    }
  } catch (e) {}
}

export { orderPostApi };
