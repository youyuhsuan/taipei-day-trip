import { createMrtListItem } from "../components/createMrtListItem.js";

async function mrtApi() {
  try {
    let response = await fetch("/api/mrts");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let responseDate = await response.json();
    let mrts = responseDate.data;
    for (let mrt of mrts) {
      createMrtListItem(mrt);
    }
  } catch (error) {
    console.error("Failed to fetch get MRT API error: ", error);
    throw error;
  }
}

mrtApi();

export { mrtApi };
