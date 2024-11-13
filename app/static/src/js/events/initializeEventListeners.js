import { attractionsApi } from "../api/attractionsGetApi.js";

function initializeEventListeners() {
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");

  if (!searchForm || !searchInput) {
    console.error("initializeEventListeners Search elements not found");
    return;
  }

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const keyword = searchInput.value.trim();
    attractionsApi(keyword);
  });

  // 委派事件處理
  document.querySelector(".search-bar").addEventListener("click", (event) => {
    const item = event.target.closest(".list-item");
    if (!item) return;

    const searchInput = document.querySelector(".search-input");
    const keyword = item.textContent.trim();
    searchInput.value = keyword;
    attractionsApi(keyword);
  });
}

export { initializeEventListeners };
