function initSkeletonLoader() {
  const listBar = document.querySelector(".list-bar");
  const attractionsContainer = document.querySelector(".attractions-container");

  // 檢查元素是否存在
  if (!listBar || !attractionsContainer) {
    console.error("找不到必要元素:", {
      listBar: !!listBar,
      attractionsContainer: !!attractionsContainer,
    });
    return;
  }

  // 當內容載入完成時
  function showContent() {
    // 標記容器為已載入
    listBar.classList.add("loaded");
    attractionsContainer.classList.add("loaded");

    // 延遲移除 skeleton 元素
    setTimeout(() => {
      const skeletonItems = listBar.querySelectorAll(".skeleton-item");
      const skeletonCards =
        attractionsContainer.querySelectorAll(".skeleton-card");

      skeletonItems.forEach((item) => item.remove());
      skeletonCards.forEach((item) => item.remove());
    }, 500);
  }

  // 檢查內容是否載入完成
  function checkContentLoaded() {
    const realCards = attractionsContainer.querySelectorAll(
      ".attractions-card:not(.skeleton-card)"
    );
    const listItems = listBar.querySelector(":not(.skeleton-item)");

    const hasRealCards = realCards.length > 0;
    const hasListItems = listItems !== null;

    return hasRealCards && hasListItems;
  }

  // 監測內容載入
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList" && checkContentLoaded()) {
        showContent();
        observer.disconnect();
        break;
      }
    }
  });

  // 開始觀察
  observer.observe(attractionsContainer, {
    childList: true,
    subtree: true,
  });
}
export { initSkeletonLoader };
