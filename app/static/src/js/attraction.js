// variables
import "./variables.js";

// api
import "./api/attractionGetApi.js";
import "./api/bookingPostApi.js";
import "./api/userAuthPutApi.js";
import "./api/userAuthGetApi.js";

// components
import "./components/bookingBtn.js";
import "./components/switchDialog.js";
import "./components/authForm.js";
import "./components/animationCarousel.js";
import "./components/switchPriceForm.js";
import "./components/bookingForm.js";

// utils
import "./components/createAttraction.js";

// events
import { initAttractionFooterMonitor } from "./events/initFooterMonitor.js";

function initApp() {
  // 初始化內容監控
  initAttractionFooterMonitor();
}

// 判斷文檔是否已加載
if (document.readyState === "loading") {
  // 如果還在加載中，監聽 DOMContentLoaded 事件
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  // 如果已經加載完成，直接執行
  initApp();
}
