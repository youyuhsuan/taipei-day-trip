let page = 0;
let current_spot = "";
let attractionsContainer = document.querySelector(".attractions-container");
let loding = false;
async function getAttractions(keyword = "") {
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
        // lastCardObserver.unobserve();
      }
    }
  } catch (error) {
    console.error(error); // Corrected this line to log the error
  } finally {
    loding = false;
  }
}

async function keywordSearch() {
  const listItem = document.querySelectorAll(".list-item");
  listItem.forEach((item) => {
    item.addEventListener("click", (event) => {
      const searchInput = document.querySelector(".search-input");
      const keyword = event.target.textContent.trim(); // Get the text content of the clicked item
      searchInput.value = keyword; // Update the input's value with the keyword
      getAttractions(keyword);
    });
  });
}

const lastCardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        getAttractions();
      }
    });
  },
  { threshold: 0.5 }
);

function createAttractionCard(name, category, mrt, image, id) {
  let attractionsCard = document.createElement("div");
  attractionsCard.className = "attractions-card";

  let cardLink = document.createElement("a");
  cardLink.className = "card-link";
  cardLink.href = `/attraction/${id}`;

  let cardImg = document.createElement("div");
  cardImg.className = "card-img";

  let img = document.createElement("img");
  img.src = image;

  let cardName = document.createElement("p");
  cardName.textContent = name;
  cardName.className = "card-name font-content bold";

  let cardContent = document.createElement("div");
  cardContent.className = "card-content font-content regular";

  let cardMrt = document.createElement("p");
  cardMrt.className = "card-mrt";
  cardMrt.textContent = mrt;

  let cardCategory = document.createElement("p");
  cardCategory.className = "card-category";
  cardCategory.textContent = category;

  attractionsCard.appendChild(cardLink);
  cardLink.appendChild(cardImg);
  cardImg.appendChild(img);
  cardImg.appendChild(cardName);
  attractionsCard.appendChild(cardContent);
  cardContent.appendChild(cardMrt);
  cardContent.appendChild(cardCategory);
  attractionsContainer.appendChild(attractionsCard);
}

async function getMrts() {
  try {
    let response = await fetch("/api/mrts");
    let responseDate = await response.json();
    let mrts = responseDate.data;
    for (let mrt of mrts) {
      createListItem(mrt);
    }
    keywordSearch();
  } catch (error) {
    console.error(error); // Corrected this line to log the error
  }
}

function createListItem(mrt) {
  const listBar = document.querySelector(".list-bar");
  const listMiddleContainer = listBar.querySelector(".list-middle-container");
  const listItems = listMiddleContainer.querySelector(".list-items");
  let listItem = document.createElement("li");
  listItem.className = "list-item font-body medium";
  listItem.textContent = mrt;
  listItems.appendChild(listItem);
}

getMrts();
getAttractions();
