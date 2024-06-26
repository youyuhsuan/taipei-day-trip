import { createMrtListItem } from "../components/createMrtListItem.js";
import { keywordSearch } from "../page/keywordSearch.js";

async function mrtApi() {
  try {
    let response = await fetch("/api/mrts");
    let responseDate = await response.json();
    let mrts = responseDate.data;
    for (let mrt of mrts) {
      createMrtListItem(mrt);
    }
    keywordSearch();
  } catch (error) {
    console.error(error);
  }
}

mrtApi();

export { mrtApi };
