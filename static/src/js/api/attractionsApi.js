import { attractionsContainer } from "../variables.js";
import { createAttractionCard } from "../components/createAttractionCard.js";

let loading = false;
let page = 0;
let current_spot = "";

// FIXME:keyword
async function attractionsApi(keyword = "") {
  if (loading) return;
  loading = true;
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
    loading = false;
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

// TODO:分檔

const listItem = document.querySelectorAll(".list-item");

function keywordSearch() {
  listItem.forEach((item) => {
    item.addEventListener("click", (event) => {
      const searchInput = document.querySelector(".search-input");
      const keyword = event.target.textContent.trim();
      searchInput.value = keyword;
      attractionsApi(keyword);
    });
  });
}

attractionsApi();
export { attractionsApi, keywordSearch };
document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const keyword = searchInput.value.trim();
    attractionsApi(keyword);
  });
});
