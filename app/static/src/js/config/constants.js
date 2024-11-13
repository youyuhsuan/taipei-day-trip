const ATTRACTIONS_CONFIG = {
  API_BASE_URL: "/api/attractions",
  INTERSECTION_THRESHOLD: 0.5,
  DEBOUNCE_DELAY: 300,
};

const CAROUSEL_CONFIG = {
  ANIMATION_DURATION: 300,
  LAZY_LOAD_THRESHOLD: 0.1,
  LAZY_LOAD_ROOT_MARGIN: "0px",
};

const SCROLL_CONFIG = {
  SCROLL_AMOUNT: 400,
  SCROLL_DURATION: 200,
};

const OBSERVER_CONFIG = {
  threshold: 0.5,
  rootMargin: "100px",
};

const VALIDATION_CONFIG = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "帳號格式不正確",
  },
  password: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
    message: "密碼格式不正確（需至少6字元，包含大小寫字母和數字）",
  },
};

const ERROR_MESSAGES_CONFIG = {
  emptySignin: "帳號或密碼不能為空值",
  emptySignup: "姓名, 電子郵件或密碼不能為空值",
  invalidEmail: "帳號格式不正確",
  invalidPassword: "密碼格式不正確",
};

export {
  CAROUSEL_CONFIG,
  ATTRACTIONS_CONFIG,
  SCROLL_CONFIG,
  OBSERVER_CONFIG,
  VALIDATION_CONFIG,
  ERROR_MESSAGES_CONFIG,
};
