import {
  signinForm,
  signupLink,
  signupForm,
  signinLink,
} from "../variables.js";
import { removePreviousMessage } from "../utils/removePreviousMessage.js";
import { renderAuthMessage } from "../utils/renderMessage.js";

async function signinData(signinEmail, signinPassword) {
  try {
    const response = await fetch("/api/user/auth", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: signinEmail, password: signinPassword }),
    });
    const responseData = await response.json();
    if (!response.ok) {
      const message = responseData["message"];
      removePreviousMessage();
      renderAuthMessage(message, signinForm, signupLink);
      return;
    }
    if (responseData.token) {
      localStorage.setItem("authToken", responseData.token);
      location.reload();
    }
  } catch (error) {
    console.error("Failed to signin error: ", error);
    throw error;
  }
}

async function signupData(signupName, signupEmail, signupPassword) {
  try {
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
      }),
    });
    console.log(response);
    const responseData = await response.json();
    const message = responseData["message"];
    if (response.ok) {
      if (responseData["ok"] === true) {
        renderAuthMessage("註冊成功", signupForm, signinLink);
        signupForm.reset();
      } else {
        renderAuthMessage(message, signupForm, signinLink);
        return;
      }
    } else {
      renderAuthMessage(message, signupForm, signinLink);
      return;
    }
  } catch (error) {
    console.error("Failed to signup error: ", error);
  }
}

export { signinData, signupData };
