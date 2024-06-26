export function createMrtListItem(mrt) {
  const listBar = document.querySelector(".list-bar");
  const listMiddleContainer = listBar.querySelector(".list-middle-container");
  const listItems = listMiddleContainer.querySelector(".list-items");
  let listItem = document.createElement("li");
  listItem.className = "list-item font-body medium";
  listItem.textContent = mrt;
  listItems.appendChild(listItem);
}
