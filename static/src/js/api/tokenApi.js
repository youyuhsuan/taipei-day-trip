import { loginBtn, logoutBtn, token } from "../variables.js";
import { handleLogout } from "../utils/handleLogout.js";
import { updateAuthButton } from "../page/updateAuthButton.js";

document.addEventListener("DOMContentLoaded", async function () {
  logoutBtn.addEventListener("click", handleLogout);
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
        if (typeof window.tokenDataCallBack === "function") {
          window.tokenDataCallBack(responseData);
        }
        console.log(responseData);
        responseData
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
    if (typeof window.tokenDataCallBack === "function") {
      window.tokenDataCallBack(null);
    }
    localStorage.removeItem("authToken");
    updateAuthButton(loginBtn, logoutBtn, true);
  }
});
