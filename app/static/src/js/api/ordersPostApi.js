import { getPrime } from "../components/tappay.js";
import { getBookingData } from "../api/bookingGetApi.js";
import { bookingDeleteApi } from "../api/bookingDeleteApi.js";
import { token } from "../variables.js";

function formatOrderData(bookingData, prime, contactInfo) {
  const { bookingName, bookingEmail, bookingPhone } = contactInfo;

  return {
    prime,
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
  };
}

function validateOrderData(bookingData, prime) {
  if (!bookingData) {
    throw new Error("Booking data is not available");
  }
  if (!prime) {
    throw new Error("Failed to generate Prime");
  }
}

async function orderPostApi(bookingName, bookingEmail, bookingPhone) {
  try {
    const bookingData = getBookingData();
    const prime = await getPrime();

    // 驗證數據
    validateOrderData(bookingData, prime);

    // 發送訂單請求
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(
        formatOrderData(bookingData, prime, {
          bookingName,
          bookingEmail,
          bookingPhone,
        })
      ),
    });
    if (!response.ok && response.status !== 400) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();

    if (responseData.error) {
      throw new Error(responseData.error);
    }
    await bookingDeleteApi(false);

    // 保存數據到 session storage
    sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
    sessionStorage.setItem("orderData", JSON.stringify(responseData.data));

    // 重定向到感謝頁面
    window.location.href = `/thankyou?number=${responseData.data.number}`;

    return responseData.data;
  } catch (error) {
    console.error("Failed to process order API error: ", error);
    throw error;
  }
}

export { orderPostApi };
