const currentUrl = window.location.href;

const regex = /\/attraction\/(\d+)/;
const match = currentUrl.match(regex);
let loding = false;

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
    slideImg.src = imageInfo;

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
    slideWidth = slides[0].getBoundingClientRect().width;
    slides.forEach(setSlidePosition);
  };

  slides.forEach(setSlidePosition);

  let reloaded = false;

  window.addEventListener("resize", handlePageChange, updateSlidePositions);
  window.addEventListener("DOMContentLoaded", handlePageChange);

  function handlePageChange() {
    if (!reloaded) {
      location.reload();
      reloaded = true;
    }
  }

  const moveToSlide = (track, currentSlide, targetSlide) => {
    track.style.transform = `translateX(-${targetSlide.style.left})`;
    currentSlide.classList.remove("current-slide");
    targetSlide.classList.add("current-slide");
    updateSlidePositions();
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
    console.log(e.target);
    if (!targetDot) return;

    const currentSlide = slideTrack.querySelector(".current-slide");
    const currentDot = dotsNav.querySelector(".current-dot");
    const targetIndex = dots.findIndex((dot) => dot === targetDot);
    const targetSlide = slides[targetIndex];

    moveToSlide(slideTrack, currentSlide, targetSlide);
    updateDots(currentDot, targetDot);
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
