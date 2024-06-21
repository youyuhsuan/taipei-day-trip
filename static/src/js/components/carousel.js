export function carousel() {
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
