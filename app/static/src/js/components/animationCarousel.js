import { CAROUSEL_CONFIG } from "../config/constants.js";
import { debounce } from "../utils/debounce.js";

function animationCarousel() {
  let currentIndex = 0;
  let isAnimating = false;

  const carouselPrevBtn = document.querySelector(".carousel-prev-button");
  const carouselNextBtn = document.querySelector(".carousel-next-button");

  const slideTrack = document.querySelector(".slide-track");
  const slides = Array.from(slideTrack.children);
  const dotsNav = document.querySelector(".dots");
  const dots = Array.from(dotsNav.children);

  function handleTransitionEnd() {
    isAnimating = false;
  }

  const updateSlidePositions = debounce(() => {
    // 關閉過渡
    slideTrack.style.transition = "none";

    // 設定寬度
    slideTrack.style.width = `${slides.length * 100}%`;
    slides.forEach((slide, index) => {
      slide.style.width = `${100 / slides.length}%`;
    });

    // 設定位移
    const translateX = currentIndex * (100 / slides.length);
    slideTrack.style.transform = `translateX(-${translateX}%)`;

    // 強制重繪
    slideTrack.offsetHeight;

    // 重新開啟過渡
    requestAnimationFrame(() => {
      slideTrack.style.transition = "transform 300ms ease-in-out";
    });

    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add("current-dot");
      } else {
        dot.classList.remove("current-dot");
      }
    });
  }, 150);

  function initializeCarousel() {
    // 初始化位置
    updateSlidePositions();

    // 綁定事件
    window.addEventListener("resize", updateSlidePositions);
    slideTrack.addEventListener("transitionend", handleTransitionEnd);

    if (carouselNextBtn && carouselPrevBtn) {
      carouselNextBtn.addEventListener("click", () => handleNavigation("next"));
      carouselPrevBtn.addEventListener("click", () => handleNavigation("prev"));
    }

    dotsNav.addEventListener("click", (e) => {
      const targetDot = e.target.closest("li");
      if (!targetDot) return;

      const targetIndex = dots.indexOf(targetDot);
      updateSlidePositions(slides[targetIndex]);
    });
  }

  // 導航處理
  function handleNavigation(direction) {
    if (isAnimating) return;

    const totalSlides = slides.length;

    if (direction === "next") {
      currentIndex = (currentIndex + 1) % totalSlides;
    } else if (direction === "prev") {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    }

    updateSlidePositions();
  }

  function initializeLazyLoading() {
    let isPreloading = false;
    const loadedImages = new Set();
    const loadingStates = new Map();

    //  預加載相鄰圖片
    const preloadAdjacentSlides = async () => {
      if (isPreloading || !slides?.length) {
        return;
      }
      isPreloading = true;
      try {
        const totalSlides = slides.length;

        //  計算預加載的索引
        const getValidIndex = (index) => {
          return ((index % totalSlides) + totalSlides) % totalSlides;
        };
        const preloadIndices = [
          currentIndex,
          getValidIndex(currentIndex + 1),
          getValidIndex(currentIndex - 1),
          getValidIndex(currentIndex + 2),
          getValidIndex(currentIndex - 2),
        ];
        const uniqueIndices = [...new Set(preloadIndices)];

        for (const index of uniqueIndices) {
          const slide = slides[index];
          if (!slide) {
            continue;
          }
          const img = slide.querySelector("img[data-src]");
          try {
            await loadImage(img);
          } catch (error) {
            console.error(`Slide ${index} 的圖片加載失敗:`, error);
          }
        }
      } finally {
        isPreloading = false;
      }
    };

    // 圖片加載邏輯
    const loadImage = (img) => {
      if (!img || !img.dataset.src) {
        return Promise.resolve();
      }
      const imageUrl = img.dataset.src;
      // 檢查加載
      if (loadingStates.has(imageUrl)) {
        return loadingStates.get(imageUrl);
      }
      if (loadedImages.has(imageUrl)) {
        img.style.display = "block";
        return Promise.resolve();
      }
      const loadPromise = new Promise((resolve, reject) => {
        const tempImg = new Image();
        tempImg.onload = () => {
          try {
            requestAnimationFrame(() => {
              img.src = imageUrl;
              img.removeAttribute("data-src");
              img.classList.remove("skeleton-box");
              img.classList.remove("loading");
              img.classList.add("loaded");
              loadedImages.add(imageUrl);
              loadingStates.delete(imageUrl);
              resolve();
            });
          } catch (error) {
            console.error("設置圖片屬性時發生錯誤:", error);
            loadingStates.delete(imageUrl);
            reject(error);
          }
        };

        tempImg.onerror = (error) => {
          console.error("圖片加載失敗:", imageUrl, error);
          loadingStates.delete(imageUrl);
          reject(new Error(`Failed to load image: ${imageUrl}`));
        };

        tempImg.src = imageUrl;
      });

      loadingStates.set(imageUrl, loadPromise);
      return loadPromise;
    };

    // debounce
    const handleSlideChange = debounce(() => {
      if (!isAnimating) {
        requestAnimationFrame(() => {
          preloadAdjacentSlides();
        });
      }
    }, 300);

    // Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const img = entry.target.querySelector("img[data-src]");
          if (!img || !img.dataset.src) return;
          loadImage(img).then(() => {
            observer.unobserve(entry.target);
          });
        });
      },
      {
        root: null,
        rootMargin: CAROUSEL_CONFIG.LAZY_LOAD_ROOT_MARGIN || "50px",
        threshold: CAROUSEL_CONFIG.LAZY_LOAD_THRESHOLD || 0.1,
      }
    );

    // 過濾並觀察有效的 slides
    const validSlides = slides.filter(
      (slide) => slide && slide.querySelector("img[data-src]")
    );

    validSlides.forEach((slide) => observer.observe(slide));

    // 初始化
    preloadAdjacentSlides();
    slideTrack.addEventListener("transitionend", handleSlideChange);

    return () => {
      observer.disconnect();
      slideTrack.removeEventListener("transitionend", handleSlideChange);
      loadingStates.clear();
      const style = document.getElementById(styleId);
      if (style) style.remove();
    };
  }

  function initializeAll() {
    initializeCarousel();
    const lazyLoadCleanup = initializeLazyLoading();
    // 返回組合的清理函數
    return () => {
      // 清理基本輪播功能
      window.removeEventListener("resize", updateSlidePositions);
      slideTrack.removeEventListener("transitionend", handleTransitionEnd);
      // 清理懶加載
      if (typeof lazyLoadCleanup === "function") {
        lazyLoadCleanup();
      }
    };
  }

  return initializeAll();
}

export { animationCarousel };
