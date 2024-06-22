export function createAttraction(
  nameInfo,
  categoryInfo,
  descriptionInfo,
  addressInfo,
  transportInfo,
  mrtInfo,
  imagesInfo
) {
  let carousel = document.querySelector(".carousel");
  let dots = document.querySelector(".dots");
  let attractionContent = document.querySelector(".attraction-content");

  let info = document.querySelector(".info");
  let address = info.querySelector(".address");
  let transport = info.querySelector(".transport");

  let slideTrack = document.createElement("ul");
  slideTrack.className = "slide-track";

  carousel.insertBefore(slideTrack, carousel.firstChild);

  imagesInfo.forEach((imageInfo, index) => {
    let slide = document.createElement("li");
    slide.className = "slide";

    if (index === 0) {
      slide.classList.add("current-slide");
    }

    let slideImg = document.createElement("img");
    slideImg.dataset.src = imageInfo;
    slideImg.alt = nameInfo;
    slideImg.setAttribute("loading", "lazy");

    let dot = document.createElement("li");
    dot.className = "dot";

    if (index === 0) {
      dot.classList.add("current-dot");
    }
    dots.appendChild(dot);
    slideTrack.appendChild(slide);
    slide.appendChild(slideImg);
  });

  let attractionName = document.createElement("h3");
  attractionName.className = "attraction-name bold";
  attractionName.textContent = nameInfo;

  let attractionDescription = document.createElement("p");
  attractionDescription.className = "attraction-description font-body regular";
  attractionDescription.textContent = categoryInfo + " at " + mrtInfo;

  let description = document.createElement("div");
  description.className = "description font-content";
  description.textContent = descriptionInfo;

  let addressContent = document.createElement("div");
  addressContent.className = "address-content font-content";
  addressContent.textContent = addressInfo;

  let transportContent = document.createElement("div");
  transportContent.className = "transport-content font-content";
  transportContent.textContent = transportInfo;

  attractionContent.insertBefore(attractionName, attractionContent.firstChild);
  attractionName.after(attractionDescription);
  address.appendChild(addressContent);
  address.before(description);
  transport.appendChild(transportContent);
}
