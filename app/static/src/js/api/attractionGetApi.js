import { createAttraction } from "../components/createAttraction.js";
import { setPrice } from "../components/switchPriceForm.js";
import { animationCarousel } from "../components/animationCarousel.js";

const url = new URL(window.location.href);
const pathSegments = url.pathname.split("/");
const attractionId = pathSegments.includes("attraction")
  ? pathSegments[pathSegments.indexOf("attraction") + 1]
  : null;

let loading = false;

if (attractionId) {
  attractionApi(attractionId);
}

async function attractionApi(attractionId) {
  if (loading) return;
  loading = true;
  try {
    const response = await fetch(`/api/attraction/${attractionId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    const { name, category, description, address, transport, mrt, images } =
      responseData.data;
    await createAttraction(
      name,
      category,
      description,
      address,
      transport,
      mrt,
      images
    );
    await animationCarousel();
    await setPrice();
  } catch (error) {
    console.error("Failed to fetch attraction get API error: ", error);
    throw error;
  } finally {
    loading = false;
  }
}

export { attractionApi };
