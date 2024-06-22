import { attractionsContainer } from "../variables.js";
import { createAttractionCard } from "../utils/createAttractionCard.js";

let loding = false;
let page = 0;
let current_spot = "";

async function attractionsApi(keyword = "") {
  if (loding) return;
  loding = true;
  try {
    if (keyword) {
      page = 0;
    }
    let url = `/api/attractions?page=${page}`;
    if (keyword) {
      current_spot = keyword;
      url += `&keyword=${current_spot}`;
      attractionsContainer.innerHTML = "";
    } else if (current_spot) {
      url += `&keyword=${current_spot}`;
    }
    const response = await fetch(url);
    const responseData = await response.json();
    let data = responseData.data;
    let nextpage = responseData.nextPage;
    if (data) {
      for (let entries of data) {
        let id = entries.id;
        let name = entries.name;
        let mrt = entries.mrt;
        let category = entries.category;
        let image = entries.images[0];
        createAttractionCard(name, category, mrt, image, id);
      }
      if (nextpage) {
        lastCardObserver.observe(document.querySelector(".footerr"));
        page = nextpage;
      } else {
        lastCardObserver.disconnect();
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    loding = false;
  }
}

const lastCardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        attractionsApi();
      }
    });
  },
  { threshold: 0.5 }
);

attractionsApi();

export { attractionsApi };
