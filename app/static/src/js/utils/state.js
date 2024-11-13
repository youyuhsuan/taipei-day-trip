const state = {
  loading: false,
  page: 0,
  currentSpot: "",
  hasMore: true,
};

function updateState(updates) {
  Object.assign(state, updates);
}

export { state, updateState };
