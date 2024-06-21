import { attractionsApi } from "../api/attractionsApi.js";

const listItem = document.querySelectorAll(".list-item");

export async function keywordSearch() {
  listItem.forEach((item) => {
    item.addEventListener("click", (event) => {
      const searchInput = document.querySelector(".search-input");
      const keyword = event.target.textContent.trim();
      searchInput.value = keyword;
      attractionsApi(keyword);
    });
  });
}
