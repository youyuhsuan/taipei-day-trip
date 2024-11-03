let currentIndex = 0;

function animationCarousel() {
  const elements = {
    carouselPrevBtn: document.querySelector(".carousel-prev-button"),
    carouselNextBtn: document.querySelector(".carousel-next-button"),
    slideTrack: document.querySelector(".slide-track"),
    dotsNav: document.querySelector(".dots"),
  };

  const slides = Array.from(elements.slideTrack.children);
  const dots = Array.from(elements.dotsNav.children);

  function getSlideWidth() {
    return slides[0].getBoundingClientRect().width;
  }

  function setSlidePosition(slide, index) {
    slide.style.left = `${100 * index}%`;
  }

  function updateSlidePositions() {
    const slideWidth = getSlideWidth();
    slides.forEach((slide) => {
      slide.style.width = `${slideWidth}px`;
    });
    elements.slideTrack.style.transform = `translateX(-${
      currentIndex * slideWidth
    }px)`;
  }

  function moveToSlide(targetSlide) {
    currentIndex = slides.indexOf(targetSlide);
    const targetSlideLeft = currentIndex * getSlideWidth();
    elements.slideTrack.style.transform = `translateX(-${targetSlideLeft}px)`;

    slides.forEach((slide, index) => {
      slide.classList.toggle("current-slide", index === currentIndex);
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("current-dot", index === currentIndex);
    });
  }

  function handleNavigation(direction) {
    const currentSlide = slides[currentIndex];
    let targetSlide;

    if (direction === "next") {
      targetSlide = currentSlide.nextElementSibling || slides[0];
    } else {
      targetSlide =
        currentSlide.previousElementSibling || slides[slides.length - 1];
    }

    moveToSlide(targetSlide);
  }

  function initializeCarousel() {
    slides.forEach(setSlidePosition);
    updateSlidePositions();
    window.addEventListener("resize", updateSlidePositions);

    elements.carouselNextBtn.addEventListener("click", () =>
      handleNavigation("next")
    );
    elements.carouselPrevBtn.addEventListener("click", () =>
      handleNavigation("prev")
    );

    elements.dotsNav.addEventListener("click", (e) => {
      const targetDot = e.target.closest("li");
      if (!targetDot) return;

      const targetIndex = dots.indexOf(targetDot);
      moveToSlide(slides[targetIndex]);
    });
  }

  function initializeLazyLoading() {
    const lazyLoad = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target.querySelector("img");
          if (img?.dataset.src) {
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

    slides.forEach((slide) => observer.observe(slide));
  }

  initializeCarousel();
  initializeLazyLoading();
}

export { animationCarousel };
