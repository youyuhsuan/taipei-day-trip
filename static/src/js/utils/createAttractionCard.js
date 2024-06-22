import { attractionsContainer } from "../variables.js";

function createAttractionCard(name, category, mrt, image, id) {
  if (!attractionsContainer) return;
  let attractionsCard = document.createElement("figure");
  attractionsCard.className = "attractions-card";
  attractionsCard.setAttribute("loading", "lazy");

  let cardLink = document.createElement("a");
  cardLink.className = "card-link";
  cardLink.href = `/attraction/${id}`;

  let cardImg = document.createElement("div");
  cardImg.className = "card-img";

  let img = document.createElement("img");
  img.src = image;
  img.alt = name;
  img.setAttribute("loading", "lazy");

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

export { createAttractionCard };
