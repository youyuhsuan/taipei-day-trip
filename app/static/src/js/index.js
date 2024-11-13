// variables
import "./variables.js";

// api
import { debouncedApi } from "./api/attractionsGetApi.js";
import "./api/mrtGetApi.js";
import "./api/userAuthPutApi.js";
import "./api/userAuthGetApi.js";

// components
import "./components/bookingBtn.js";
import "./components/switchDialog.js";
import "./components/authForm.js";
import "./components/animationListBar.js";
import "./components/loadHeroBackground.js";
import { cleanup } from "./components/createAttractionCard.js";

// utils
import "./utils/createCookie.js";
import "./utils/state.js";
import "./utils/debounce.js";

// events
import { initSkeletonLoader } from "./events/initSkeletonLoader.js";
import { initializeEventListeners } from "./events/initializeEventListeners.js";

function initApp() {
  // 初始化 Skeleton Loader
  initSkeletonLoader();

  // 初始化 API 和事件監聽
  debouncedApi();
  initializeEventListeners();
}

// 判斷文檔是否已加載
if (document.readyState === "loading") {
  // 如果還在加載中，監聽 DOMContentLoaded 事件
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  // 如果已經加載完成，直接執行
  initApp();
}

window.addEventListener("unload", cleanup);
