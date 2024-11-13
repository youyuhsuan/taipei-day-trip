let carousel = document.querySelector(".carousel");
let dots = document.querySelector(".dots");
let attractionContent = document.querySelector(".attraction-content");

let info = document.querySelector(".info");
let address = info.querySelector(".address");
let transport = info.querySelector(".transport");

function createAttraction(
  nameInfo,
  categoryInfo,
  descriptionInfo,
  addressInfo,
  transportInfo,
  mrtInfo,
  imagesInfo
) {
  carousel.className = "carousel skeleton";

  const createSlide = (imageInfo, index) => {
    const slide = document.createElement("li");
    if (index === 0) {
      slide.classList.add("current-slide");
    }
    slide.className = "slide skeleton-box";

    // Image
    const slideImg = document.createElement("img");
    slideImg.className = "slide loading";
    slideImg.dataset.src = imageInfo;
    slideImg.alt = nameInfo;
    slideImg.setAttribute("loading", "lazy");

    const loadImage = () => {
      const fullImage = new Image();

      fullImage.onload = () => {
        requestAnimationFrame(() => {
          slideImg.src = imageInfo;

          slideImg.classList.remove("loading");
          slideImg.classList.add("loaded");

          carousel.classList.remove("skeleton");
          slide.classList.remove("skeleton-box");
        });
      };

      fullImage.onerror = () => {
        console.error("Image load failed:", imageInfo);
        carousel.classList.remove("skeleton");
        slide.classList.remove("skeleton-box");
      };

      fullImage.src = imageInfo;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage();
            observer.unobserve(slide);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(slide);
    slide.appendChild(slideImg);
    return slide;
  };

  const createDot = (index) => {
    const dot = document.createElement("li");
    dot.className = "dot";
    if (index === 0) {
      dot.classList.add("current-dot");
    }
    return dot;
  };

  const slideTrack = document.createElement("ul");
  slideTrack.className = "slide-track skeleton-box";
  carousel.insertBefore(slideTrack, carousel.firstChild);

  imagesInfo.forEach((imageInfo, index) => {
    const slide = createSlide(imageInfo, index);
    const dot = createDot(index);
    slideTrack.appendChild(slide);
    dots.appendChild(dot);
  });

  const attractionName = document.createElement("h3");
  attractionName.className = "attraction-name bold";
  attractionName.textContent = nameInfo;

  const attractionDescription = document.createElement("p");
  attractionDescription.className = "attraction-description font-body regular";
  attractionDescription.textContent = `${categoryInfo} at ${mrtInfo}`;

  const description = document.createElement("div");
  description.className = "description font-content";
  description.textContent = descriptionInfo;

  const addressContent = document.createElement("div");
  addressContent.className = "address-content font-content";
  addressContent.textContent = addressInfo;

  const transportContent = document.createElement("div");
  transportContent.className = "transport-content font-content";
  transportContent.textContent = transportInfo;

  attractionContent.insertBefore(attractionName, attractionContent.firstChild);
  attractionName.after(attractionDescription);
  address.before(description);
  address.appendChild(addressContent);
  transport.appendChild(transportContent);
}

export { createAttraction };
