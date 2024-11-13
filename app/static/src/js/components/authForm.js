import {
  signinForm,
  signupLink,
  signupForm,
  signinLink,
} from "../variables.js";
import { removePreviousMessage } from "../utils/removePreviousMessage.js";
import { renderAuthMessage } from "../utils/renderMessage.js";
import { signinData, signupData } from "../api/userAuthPutApi.js";
import {
  VALIDATION_CONFIG,
  ERROR_MESSAGES_CONFIG,
} from "../config/constants.js";

function validateForm(values, type = "signin") {
  if (Object.values(values).some((value) => value === "")) {
    return {
      isValid: false,
      message:
        type === "signin"
          ? ERROR_MESSAGES_CONFIG.emptySignin
          : ERROR_MESSAGES_CONFIG.emptySignup,
    };
  }

  if (!VALIDATION_CONFIG.email.pattern.test(values.email)) {
    return {
      isValid: false,
      message: ERROR_MESSAGES_CONFIG.invalidEmail,
    };
  }

  if (!VALIDATION_CONFIG.password.pattern.test(values.password)) {
    return {
      isValid: false,
      message: ERROR_MESSAGES_CONFIG.invalidPassword,
    };
  }

  return { isValid: true };
}

async function handleSignin(event) {
  event.preventDefault();
  removePreviousMessage();

  // 獲取表單數據
  const formData = {
    email: document.getElementById("signin-email").value.trim(),
    password: document.getElementById("signin-password").value.trim(),
  };

  // 驗證表單
  const validation = validateForm(formData, "signin");
  if (!validation.isValid) {
    renderAuthMessage(validation.message, signinForm, signupLink);
    return;
  }

  try {
    await signinData(formData.email, formData.password);
  } catch (error) {
    console.error("Failed to sign in error: ", error);
    renderAuthMessage("登入失敗，請稍後再試", signinForm, signupLink);
  }
}

async function handleSignup(event) {
  event.preventDefault();
  removePreviousMessage();

  // 獲取表單數據
  const formData = {
    name: document.getElementById("signup-name").value.trim(),
    email: document.getElementById("signup-email").value.trim(),
    password: document.getElementById("signup-password").value.trim(),
  };

  // 驗證表單
  const validation = validateForm({ ...formData }, "signup");
  if (!validation.isValid) {
    renderAuthMessage(validation.message, signupForm, signinLink);
    return;
  }

  try {
    await signupData(formData.name, formData.email, formData.password);
  } catch (error) {
    console.error("Failed to sign up error: ", error);
    renderAuthMessage("註冊失敗，請稍後再試", signupForm, signinLink);
  }
}

// 綁定事件監聽器
signinForm.addEventListener("submit", handleSignin);
signupForm.addEventListener("submit", handleSignup);

export { handleSignin, handleSignup };
