const dialogs = document.querySelectorAll("dialog");

const signinDialog = document.querySelector(".signin-dialog");
const signupDialog = document.querySelector(".signup-dialog");

const openDialogButton = document.querySelector(".open-dialog");
const closeDialogButton = document.querySelectorAll(".close-dialog");

const signinForm = signinDialog.querySelector(".signin-form");
const signupForm = signupDialog.querySelector(".signup-form");
const signinLink = signupForm.querySelector(".signin-link");
const signupLink = signinForm.querySelector(".signup-link");

openDialogButton.addEventListener("click", () => {
  signinDialog.showModal();
});

closeDialogButton.forEach((button) => {
  button.addEventListener("click", () => {
    signinForm.reset();
    signupForm.reset();
    removePreviousMessage();
    signinDialog.close();
    signupDialog.close();
  });
});

signupLink.addEventListener("click", () => {
  signinForm.reset();
  removePreviousMessage();
  signinDialog.close();
  signupDialog.showModal();
});

signinLink.addEventListener("click", () => {
  signupForm.reset();
  removePreviousMessage();
  signupDialog.close();
  signinDialog.showModal();
});

signinForm.addEventListener("submit", async function (event) {
  let signinEmail = document.getElementById("signin-email").value.trim();
  let signinPassword = document.getElementById("signin-password").value.trim();
  event.preventDefault();
  removePreviousMessage();
  if (signinEmail === "" || signinPassword === "") {
    displayMessage("帳號或密碼不能為空值", signinForm, signupLink);
    return;
  }
  await signinData(signinEmail, signinPassword);
});

signupForm.addEventListener("submit", async function (event) {
  let signupName = document.getElementById("signup-name").value.trim();
  let signupEmail = document.getElementById("signup-email").value.trim();
  let signupPassword = document.getElementById("signup-password").value.trim();
  event.preventDefault();
  removePreviousMessage();
  if (signupName === "" || signupEmail === "" || signupPassword === "") {
    displayMessage("姓名, 電子郵件或密碼不能為空值", signupForm, signinLink);
    return;
  }
  await signupData(signupName, signupEmail, signupPassword);
});

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
      let loginBtn = document.querySelector(".login-btn");
      let logoutBtn = document.querySelector(".logout-btn");
      localStorage.setItem("authToken", responseData.token);
      console.log("reload first");
      location.reload();
      console.log("reload second");
    }
  } catch (e) {
    console.error(e);
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
    console.error(e);
  }
}

function displayMessage(message, form, anchorElement) {
  let messageSpan = document.createElement("span");
  messageSpan.className = "error-message";
  removePreviousMessage();
  if (message === "註冊成功") {
    messageSpan.className = "success-message";
  }
  messageSpan.textContent = message;
  form.insertBefore(messageSpan, anchorElement);
}

function removePreviousMessage() {
  let errorMessages = document.querySelectorAll(".error-message");
  let successMessages = document.querySelectorAll(".success-message");
  errorMessages.forEach(function (message) {
    message.remove();
  });
  successMessages.forEach(function (message) {
    message.remove();
  });
}

function updateAuthButton(loginBtn, logoutBtn, isLoggedIn) {
  loginBtn.classList.toggle("active", isLoggedIn);
  logoutBtn.classList.toggle("active", !isLoggedIn);
}

function handleLogout() {
  let loginBtn = document.querySelector(".login-btn");
  let logoutBtn = document.querySelector(".logout-btn");
  localStorage.removeItem("authToken");
  updateAuthButton(loginBtn, logoutBtn, false);
  location.reload();
}

document.addEventListener("DOMContentLoaded", async function () {
  let loginBtn = document.querySelector(".login-btn");
  let logoutBtn = document.querySelector(".logout-btn");
  logoutBtn.addEventListener("click", handleLogout);
  let token = localStorage.getItem("authToken");

  if (token) {
    try {
      const response = await fetch("/api/user/auth", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response) {
        const responseData = await response.json();
        responseData.data
          ? updateAuthButton(loginBtn, logoutBtn, false)
          : handleLogout();
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      handleLogout();
    }
  } else {
    localStorage.removeItem("authToken");
    updateAuthButton(loginBtn, logoutBtn, true);
  }
});
