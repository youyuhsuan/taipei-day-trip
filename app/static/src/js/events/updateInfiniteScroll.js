import { state, updateState } from "../utils/state.js";
import { OBSERVER_CONFIG } from "../config/constants.js";
import { debouncedApi } from "../api/attractionsGetApi.js";

const lastCardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !state.loading && state.hasMore) {
      debouncedApi(state.currentSpot);
    }
  });
}, OBSERVER_CONFIG);

function updateInfiniteScroll(nextPage) {
  const footer = document.getElementsByTagName("footer")[0];

  if (!footer) {
    console.error("updateInfiniteScroll Footer element not found");
    return;
  }

  if (nextPage) {
    lastCardObserver.observe(footer);
    updateState({ page: nextPage, hasMore: true });
  } else {
    lastCardObserver.disconnect();
    updateState({ hasMore: false });
  }
}

export { updateInfiniteScroll };
