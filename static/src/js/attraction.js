const currentUrl = window.location.href;

const regex = /\/attraction\/(\d+)/;
const match = currentUrl.match(regex);
let loding = false;
let currentIndex = 0;

if (match) {
  const attractionId = match[1];
  getAttraction(attractionId);
} else {
  console.log("No ID found in URL");
}

async function getAttraction(attractionId) {
  if (loding) return;
  loding = true;
  try {
    const response = await fetch(`/api/attraction/${attractionId}`);
    const responseData = await response.json();
    let data = responseData.data;
    if (data) {
      let nameInfo = data.name;
      let categoryInfo = data.category;
      let descriptionInfo = data.description;
      let addressInfo = data.address;
      let transportInfo = data.transport;
      let mrtInfo = data.mrt;
      let imagesInfo = data.images;
      createAttraction(
        nameInfo,
        categoryInfo,
        descriptionInfo,
        addressInfo,
        transportInfo,
        mrtInfo,
        imagesInfo
      );
      carousel();
      radio();
    }
  } catch (error) {
    console.error(error);
  } finally {
    loding = false;
  }
}

function createAttraction(
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
    slideImg.dataset.src = imageInfo; // 使用 data-src 屬性來存儲圖片 URL
    slideImg.placeholder = "blur";

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

function carousel() {
  let carouselPrevBtn = document.querySelector(".carousel-prev-button");
  let carouselNextBtn = document.querySelector(".carousel-next-button");
  let slideTrack = document.querySelector(".slide-track");
  let slides = Array.from(slideTrack.children);
  let dotsNav = document.querySelector(".dots");
  let dots = Array.from(dotsNav.children);

  let slideWidth = slides[0].getBoundingClientRect().width;

  const setSlidePosition = (slide, index) => {
    slide.style.left = slideWidth * index + "px";
  };

  const updateSlidePositions = () => {
    const slideWidth = slides[0].getBoundingClientRect().width;

    slides.forEach((slide) => {
      slide.style.width = `${slideWidth}px`;
    });

    const currentSlideLeft = currentIndex * slideWidth;
    slideTrack.style.transform = `translateX(-${currentSlideLeft}px)`;
  };

  slides.forEach((slide, index) => {
    slide.style.left = `${index * 100}%`;
  });

  window.addEventListener("resize", updateSlidePositions);

  const moveToSlide = (track, currentSlide, targetSlide) => {
    currentIndex = slides.indexOf(targetSlide);
    const slideWidth = slides[0].getBoundingClientRect().width;
    const targetIndex = slides.indexOf(targetSlide);
    const targetSlideLeft = targetIndex * slideWidth;

    track.style.transform = `translateX(-${targetSlideLeft}px)`;
    currentSlide.classList.remove("current-slide");
    targetSlide.classList.add("current-slide");
  };

  const updateDots = (currentDot, targetDot) => {
    currentDot.classList.remove("current-dot");
    targetDot.classList.add("current-dot");
  };

  carouselNextBtn.addEventListener("click", () => {
    const currentSlide = slideTrack.querySelector(".current-slide");
    const currentDot = dotsNav.querySelector(".current-dot");
    let nextSlide = currentSlide.nextElementSibling;
    let nextDot = currentDot.nextElementSibling;

    if (!nextSlide) {
      nextSlide = slides[0];
      nextDot = dots[0];
    }

    moveToSlide(slideTrack, currentSlide, nextSlide);
    updateDots(currentDot, nextDot);
  });

  carouselPrevBtn.addEventListener("click", () => {
    const currentSlide = slideTrack.querySelector(".current-slide");
    const currentDot = dotsNav.querySelector(".current-dot");
    let prevSlide = currentSlide.previousElementSibling;
    let prevDot = currentDot.previousElementSibling;

    if (!prevSlide) {
      prevSlide = slides[slides.length - 1];
      prevDot = dots[dots.length - 1];
    }

    moveToSlide(slideTrack, currentSlide, prevSlide);
    updateDots(currentDot, prevDot);
  });

  dotsNav.addEventListener("click", (e) => {
    const targetDot = e.target.closest("li");
    if (!targetDot) return;

    const currentSlide = slideTrack.querySelector(".current-slide");
    const currentDot = dotsNav.querySelector(".current-dot");
    const targetIndex = dots.findIndex((dot) => dot === targetDot);
    const targetSlide = slides[targetIndex];

    moveToSlide(slideTrack, currentSlide, targetSlide);
    updateDots(currentDot, targetDot);
  });

  // Intersection Observer for lazy loading images
  const lazyLoad = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target.querySelector("img");
        if (img && img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
        }
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(lazyLoad, {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  });

  slides.forEach((slide) => {
    observer.observe(slide);
  });
}

function radio() {
  const bookingForm = document.querySelector(".booking-form");
  const radio = bookingForm.querySelector(".radio");
  const morning = document.getElementById("morning");
  const afternoon = document.getElementById("afternoon");
  const price = bookingForm.querySelector(".price");
  const priceAmount = price.querySelector(".price-amount");

  priceAmount.textContent = "新台幣 2000元";

  morning.addEventListener("click", () => {
    priceAmount.textContent = "新台幣 2000元";
  });

  afternoon.addEventListener("click", () => {
    priceAmount.textContent = "新台幣 2500元";
  });
}
