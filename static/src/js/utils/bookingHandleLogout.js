import { loginBtn, logoutBtn, token } from "../variables.js";
import { handleLogoutAndRedirect } from "../utils/handleLogout.js";
import { updateAuthButton } from "../page/updateAuthButton.js";

let glbalToken;
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
        glbalToken = responseData;
        if (typeof window.tokenDataCallBack === "function") {
          window.tokenDataCallBack(responseData);
        }
        responseData
          ? updateAuthButton(loginBtn, logoutBtn, false)
          : handleLogoutAndRedirect();
      } else {
        glbalToken = null;
        handleLogoutAndRedirect();
      }
    } catch (error) {
      glbalToken = null;
      console.error("Error fetching user data:", error);
      handleLogoutAndRedirect();
    }
  } else {
    glbalToken = null;
    if (typeof window.tokenDataCallBack === "function") {
      window.tokenDataCallBack(null);
    }
    console.log("TOKEN NONE");
    localStorage.removeItem("authToken");
    updateAuthButton(loginBtn, logoutBtn, true);
  }
});
export {glbalToken};
