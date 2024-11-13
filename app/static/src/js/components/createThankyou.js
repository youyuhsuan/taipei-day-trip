function getStorageData() {
  try {
    const bookingData = JSON.parse(sessionStorage.getItem("bookingData"));
    const orderData = JSON.parse(sessionStorage.getItem("orderData"));

    if (!bookingData || !orderData) {
      throw new Error("Required data not found in sessionStorage");
    }

    return { bookingData, orderData };
  } catch (error) {
    console.error("Failed to get storage data error: ", error);
    return null;
  }
}

function updateThankYouPage() {
  try {
    const data = getStorageData();
    if (!data) return;

    const { bookingData, orderData } = data;

    // 更新訂單資訊
    document.querySelector(
      ".thankyou-number"
    ).textContent = `訂單編號：${orderData.number}`;
    document.querySelector(
      ".thankyou-message"
    ).textContent = `訂單資訊：${orderData.payment.message}`;

    // 更新圖片
    const img = document.querySelector(".thankyou-image img");
    if (img) {
      img.src = bookingData.attraction.image;
      img.alt = bookingData.attraction.name;
      img.setAttribute("loading", "lazy");
    }

    // 更新訂單詳情
    document.querySelector(
      ".thankyou-name"
    ).textContent = `訂單名稱：${bookingData.attraction.name}`;
    document.querySelector(
      ".thankyou-date"
    ).textContent = `訂單日期：${bookingData.date}`;
    document.querySelector(
      ".thankyou-price"
    ).textContent = `訂單價格：${bookingData.price}`;
    document.querySelector(
      ".thankyou-time"
    ).textContent = `預約時間：${bookingData.time}`;
    document.querySelector(
      ".thankyou-address"
    ).textContent = `景點地址：${bookingData.attraction.address}`;
  } catch (error) {
    console.error("Failed to update thank you page error: ", error);
    showErrorMessage();
  }
}

function showErrorMessage() {
  const message = document.querySelector(".thankyou-message");
  if (message) {
    message.textContent = "無法載入訂單資訊，請稍後再試";
  }
}

updateThankYouPage();
