let listBar = document.querySelector(".list-bar");
let listLeftContainer = document.querySelector(".list-left-container");
let arrowLeftBtn = listLeftContainer.querySelector(".arrow-btn");

let listRightContainer = document.querySelector(".list-right-container");
let arrowRightBtn = listRightContainer.querySelector(".arrow-btn");
let listItems = listBar.querySelector(".list-items");

arrowLeftBtn.addEventListener("click", () => {
  listItems.scrollBy({
    left: -120,
    behavior: "smooth",
  });
});

arrowRightBtn.addEventListener("click", () => {
  listItems.scrollBy({
    left: 120,
    behavior: "smooth",
  });
});
