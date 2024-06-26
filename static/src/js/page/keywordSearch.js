// TODO: FIX

import { attractionsApi } from "../api/attractionsApi.js";

const listItem = document.querySelectorAll(".list-item");

async function keywordSearch() {
  listItem.forEach((item) => {
    item.addEventListener("click", (event) => {
      console.log("s");
      const searchInput = document.querySelector(".search-input");
      const keyword = event.target.textContent.trim();
      searchInput.value = keyword;
      console.log(keyword, searchInput);
      attractionsApi(keyword);
    });
  });
}

export { keywordSearch };
