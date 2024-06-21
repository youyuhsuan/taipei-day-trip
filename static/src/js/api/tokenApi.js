import { loginBtn, logoutBtn, token } from "../variables.js";
import { handleLogout } from "../shared/handleLogout.js";
import { updateAuthButton } from "../shared/updateAuthButton.js";

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
    localStorage.removeItem("authToken");
    updateAuthButton(loginBtn, logoutBtn, true);
  }
});
