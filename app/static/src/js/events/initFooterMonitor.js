const footer = document.querySelector("footer");

if (!footer) {
  console.error("Footer element not found");
}

function initFooterMonitor() {
  footer.style.opacity = "1";
}

// attraction.html
function initAttractionFooterMonitor() {
  const observer = new MutationObserver((mutations) => {
    if (checkAttractionContent()) {
      footer.style.opacity = "1";
      observer.disconnect();
    }
  });

  // 設定監測配置
  const config = {
    childList: true,
    characterData: true,
    subtree: true,
  };

  // 開始監測 .info section
  const infoSection = document.querySelector("section.info");
  if (infoSection) {
    observer.observe(infoSection, config);
  }
}

function checkAttractionContent() {
  // 檢查這些元素是否有內容
  const descriptionEls = document.querySelectorAll(".info .description");
  const addressEls = document.querySelectorAll(".info .address-content");
  const transportEls = document.querySelectorAll(".info .transport-content");

  // 檢查 description 元素
  const hasDescription = Array.from(descriptionEls).some((el) => {
    return el.textContent.trim() !== "";
  });

  // 檢查 address 元素
  const hasAddress = Array.from(addressEls).some((el) => {
    return el.textContent.trim() !== "";
  });

  // 檢查 transport 元素
  const hasTransport = Array.from(transportEls).some((el) => {
    return el.textContent.trim() !== "";
  });

  // 當所有元素都有內容時，返回 true
  return hasDescription && hasAddress && hasTransport;
}

export { initFooterMonitor, initAttractionFooterMonitor };
