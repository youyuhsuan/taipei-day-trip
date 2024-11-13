import { SCROLL_CONFIG } from "../config/constants.js";
import { debounce } from "../utils/debounce.js";

const arrowLeftBtn = document.querySelector(".list-left-container .arrow-btn");
const arrowRightBtn = document.querySelector(
  ".list-right-container .arrow-btn"
);
const listItems = document.querySelector(".list-bar .list-items");

let isScrolling = false;
let animationFrameId = null;

// updateArrowVisibility
const debouncedUpdateArrowVisibility = debounce(() => {
  updateArrowVisibility();
}, 16); // 仍然使用一幀的時間(16ms)作為延遲

// 綁定事件監聽器
listItems.addEventListener("scroll", debouncedUpdateArrowVisibility);
window.addEventListener("resize", debouncedUpdateArrowVisibility);

// 事件監聽器
arrowLeftBtn.addEventListener("click", () => handleScroll("left"));
arrowRightBtn.addEventListener("click", () => handleScroll("right"));

// 更新箭頭顯示狀態
function updateArrowVisibility() {
  const totalItemsWidth = Array.from(listItems.children).reduce(
    (total, item) => total + item.offsetWidth,
    0
  );

  const canScroll = totalItemsWidth > listItems.clientWidth;

  if (!canScroll) {
    arrowLeftBtn.style.display = "none";
    arrowRightBtn.style.display = "none";
    return;
  }

  const isAtStart = Math.abs(listItems.scrollLeft) < 1;
  // 修改判斷邏輯，增加容忍度
  const maxScroll = totalItemsWidth - listItems.clientWidth;
  const isAtEnd = listItems.scrollLeft >= maxScroll - 10;

  arrowLeftBtn.style.display = isAtStart ? "none" : "block";
  arrowRightBtn.style.display = isAtEnd ? "none" : "block";

  arrowLeftBtn.style.cursor = isAtStart ? "default" : "pointer";
  arrowRightBtn.style.cursor = isAtEnd ? "default" : "pointer";
}

// 平滑滾動函數
function smoothScroll(element, target, duration) {
  if (isScrolling) return;
  isScrolling = true;

  const start = element.scrollLeft;
  const distance = target - start;
  const startTime = performance.now();
  console.log("startTime", startTime);

  function animation(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easing = 1 - (1 - progress) * (1 - progress);

    element.scrollLeft = start + distance * easing;

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animation);
    } else {
      isScrolling = false;
      cancelAnimationFrame(animationFrameId);
      updateArrowVisibility(); // 最後再次更新確保狀態正確
    }
  }

  animationFrameId = requestAnimationFrame(animation);
}

// 處理點擊事件
function handleScroll(direction) {
  const currentScroll = listItems.scrollLeft;
  const maxScroll = listItems.scrollWidth - listItems.clientWidth;

  if (direction === "left" && currentScroll <= 0) return;
  if (direction === "right" && currentScroll >= maxScroll) return;

  const target =
    direction === "left"
      ? Math.max(0, currentScroll - SCROLL_CONFIG.SCROLL_AMOUNT)
      : Math.min(maxScroll, currentScroll + SCROLL_CONFIG.SCROLL_AMOUNT);

  smoothScroll(listItems, target, SCROLL_CONFIG.SCROLL_DURATION);
}

// 觸摸事件處理
let touchStartX = 0;
let touchEndX = 0;

listItems.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
});

listItems.addEventListener("touchmove", (e) => {
  touchEndX = e.touches[0].clientX;
});

listItems.addEventListener("touchend", () => {
  const swipeDistance = touchStartX - touchEndX;
  if (Math.abs(swipeDistance) > 50) {
    handleScroll(swipeDistance > 0 ? "right" : "left");
  }
});

debouncedUpdateArrowVisibility();

// DOM 加載完成後再次檢查
document.addEventListener("DOMContentLoaded", debouncedUpdateArrowVisibility);

// 所有資源加載完成後再次檢查
window.addEventListener("load", debouncedUpdateArrowVisibility);
