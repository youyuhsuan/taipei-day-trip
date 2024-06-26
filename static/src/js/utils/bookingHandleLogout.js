import { loginBtn, logoutBtn, token } from "../variables.js";
import { handleLogoutAndRedirect } from "../utils/handleLogout.js";
import { updateAuthButton } from "../page/updateAuthButton.js";

document.addEventListener("DOMContentLoaded", async function () {
  logoutBtn.addEventListener("click", handleLogoutAndRedirect);
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
        responseData
          ? updateAuthButton(loginBtn, logoutBtn, false)
          : handleLogoutAndRedirect();
      } else {
        handleLogoutAndRedirect();
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      handleLogoutAndRedirect();
    }
  } else {
    localStorage.removeItem("authToken");
    updateAuthButton(loginBtn, logoutBtn, true);
  }
});
