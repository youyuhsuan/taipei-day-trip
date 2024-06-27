import { createMrtListItem } from "../components/createMrtListItem.js";

async function mrtApi() {
  try {
    let response = await fetch("/api/mrts");
    let responseDate = await response.json();
    let mrts = responseDate.data;
    for (let mrt of mrts) {
      createMrtListItem(mrt);
    }
  } catch (error) {
    console.error(error);
  }
}

mrtApi();

export { mrtApi };
