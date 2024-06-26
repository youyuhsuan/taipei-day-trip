import {
  displayMessage,
  removePreviousMessage,
} from "../shared/displayMessage";

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
      displayMessage(message, signinForm, signupLink);
      return;
    }
    if (responseData.token) {
      localStorage.setItem("authToken", responseData.token);
      updateAuthButton();
      location.reload();
    }
  } catch (e) {
    console.log(e);
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
    removePreviousMessage();
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
    console(responseData);
  } catch (e) {
    console.error(e);
  }
}

export { signinData, signupData };
