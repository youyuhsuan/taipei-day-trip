import { attractionsContainer } from "../variables.js";
import { ATTRACTIONS_CONFIG } from "../config/constants.js";
import {
  createAttractionCard,
  initializeAllCards,
} from "../components/createAttractionCard.js";

// utils
import { debounce } from "../utils/debounce.js";
import { state, updateState } from "../utils/state.js";

// events
import { updateInfiniteScroll } from "../events/updateInfiniteScroll.js";
import { initFooterMonitor } from "../events/initFooterMonitor.js";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 處理資料結構
async function processAttractionData(attraction) {
  const { id, name, mrt, category, images } = attraction;
  const imageUrl = images[0];
  try {
    const loadedImage = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(imageUrl);
      img.onerror = () =>
        reject(new Error(`Failed to load image: ${imageUrl}`));
      img.src = imageUrl;
    });
    return {
      id,
      name,
      mrt,
      category,
      image: loadedImage,
    };
  } catch (error) {
    console.error(`Error loading image for attraction ${id}:`, error);
    return null;
  }
}

// 獲取資料
async function fetchAttractions(keyword = "") {
  const url = new URL(ATTRACTIONS_CONFIG.API_BASE_URL, window.location.origin);
  url.searchParams.append("page", state.page);
  if (keyword || state.currentSpot) {
    url.searchParams.append("keyword", keyword || state.currentSpot);
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const responseData = await response.json();
  const processedData = await Promise.all(
    responseData.data.map(processAttractionData)
  );

  // 過濾掉null值
  const validData = processedData.filter((item) => item !== null);
  const result = {
    nextPage: responseData.nextPage,
    data: validData,
  };

  return result;
}

async function attractionsApi(keyword = "") {
  if (state.loading) return;
  try {
    updateState({ loading: true });
    if (keyword) {
      updateState({
        page: 0,
        currentSpot: keyword,
        hasMore: true,
      });
      attractionsContainer.innerHTML = "";
    }

    showLoading();
    const responseData = await fetchAttractions(keyword);
    const { data, nextPage } = responseData;

    await delay(800);

    if (!data?.length) {
      container.innerHTML = "<p>No results found</p>";
      return;
    }
    // 使用 DocumentFragment 優化 DOM 操作
    const fragment = document.createDocumentFragment();
    data.forEach((attraction) => {
      const { id, name, mrt, category, image } = attraction;
      try {
        const card = createAttractionCard(name, category, mrt, image, id);
        fragment.appendChild(card);
        initializeAllCards();
      } catch (error) {
        console.error("create attraction card error:", error);
        throw error;
      }
    });
    attractionsContainer.appendChild(fragment);

    // 更新無限滾動
    updateInfiniteScroll(nextPage);
    if (nextPage === null) {
      initFooterMonitor();
    }
  } catch (error) {
    console.error("Failed to fetch attractions API error: ", error);
  } finally {
    hideLoading();
    updateState({ loading: false });
  }
}

// Loading
function showLoading() {
  const loadingContainer = document.createElement("div");
  loadingContainer.className = "loading-container";

  const loader = document.createElement("div");
  loader.className = "loader";
  loadingContainer.appendChild(loader);

  attractionsContainer.appendChild(loadingContainer);
}

function hideLoading() {
  const loadingContainer =
    attractionsContainer.querySelector(".loading-container");
  if (loadingContainer) loadingContainer.remove();
}

// 初始化
const debouncedApi = debounce(attractionsApi, 500, true);

export { attractionsApi, debouncedApi };
