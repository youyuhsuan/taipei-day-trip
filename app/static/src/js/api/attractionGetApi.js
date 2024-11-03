import { createAttraction } from "../components/createAttraction.js";
import { setPrice } from "../components/switchPriceForm.js";
import { animationCarousel } from "../components/animationCarousel.js";

const currentUrl = window.location.href;

const regex = /\/attraction\/(\d+)/;
const match = currentUrl.match(regex);
let loding = false;

if (match) {
  const attractionId = match[1];
  attractionApi(attractionId);
} else {
  console.log("No ID found in URL");
}

async function attractionApi(attractionId) {
  if (loding) return;
  loding = true;
  try {
    const response = await fetch(`/api/attraction/${attractionId}`);
    const responseData = await response.json();
    let data = responseData.data;
    if (data) {
      let nameInfo = data.name;
      let categoryInfo = data.category;
      let descriptionInfo = data.description;
      let addressInfo = data.address;
      let transportInfo = data.transport;
      let mrtInfo = data.mrt;
      let imagesInfo = data.images;
      createAttraction(
        nameInfo,
        categoryInfo,
        descriptionInfo,
        addressInfo,
        transportInfo,
        mrtInfo,
        imagesInfo
      );
      animationCarousel();
      setPrice();
    }
  } catch (error) {
    console.error(error);
  } finally {
    loding = false;
  }
}

export { attractionApi };
