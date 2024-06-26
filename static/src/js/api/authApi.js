import {
  signinForm,
  signupLink,
  signupForm,
  signinLink,
} from "../variables.js";
import { removePreviousMessage } from "../utils/removePreviousMessage.js";
import { displayMessage } from "../utils/displayMessage.js";

async function signinData(signinEmail, signinPassword) {
  try {
    const response = await fetch("/api/user/auth", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: signinEmail, password: signinPassword }),
    });
    if (!response.ok) {
      const message = responseData["message"];
      removePreviousMessage();
      displayMessage(message, signinForm, signupLink);
      return;
    }
    const responseData = await response.json();
    if (responseData.token) {
      localStorage.setItem("authToken", responseData.token);
      location.reload();
    }
  } catch (e) {
    console.error("signinData Error:", e);
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
    const responseData = await response.json();
    const message = responseData["message"];
    if (response.ok) {
      if (responseData["ok"] === true) {
        displayMessage("註冊成功", signupForm, signinLink);
        signupForm.reset();
      } else {
        displayMessage(message, signupForm, signinLink);
        return;
      }
    } else {
      displayMessage(message, signupForm, signinLink);
      return;
    }
  } catch (e) {
    console.error("signupData Error:", e);
  }
}

export { signinData, signupData };
