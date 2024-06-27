import { attractionsApi } from "../api/attractionsApi.js";

export function createMrtListItem(mrt) {
  const listBar = document.querySelector(".list-bar");
  const listMiddleContainer = listBar.querySelector(".list-middle-container");
  const listItems = listMiddleContainer.querySelector(".list-items");
  let listItem = document.createElement("li");
  listItem.className = "list-item font-body medium";
  listItem.textContent = mrt;
  listItem.onclick = function () {
    attractionsApi(mrt);
    let searchInput = document.getElementById("search-input");
    searchInput.value = mrt;
  };
  listItems.appendChild(listItem);
}
