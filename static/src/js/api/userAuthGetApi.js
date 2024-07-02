import { loginBtn, logoutBtn, token } from "../variables.js";
import { switchLogoutAndRedirect } from "../utils/switchLogout.js";
import { switchAuthButton } from "../utils/switchAuthButton.js";

let glbalToken = null;

document.addEventListener("DOMContentLoaded", async function () {
  logoutBtn.addEventListener("click", switchLogoutAndRedirect);
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
          ? switchAuthButton(loginBtn, logoutBtn, false)
          : switchLogoutAndRedirect();
      } else {
        switchLogoutAndRedirect();
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      switchLogoutAndRedirect();
    }
  } else {
    if (typeof window.tokenDataCallBack === "function") {
      window.tokenDataCallBack(null);
    }
    console.log("TOKEN NONE");
    localStorage.removeItem("authToken");
    switchAuthButton(loginBtn, logoutBtn, true);
  }
});
export { glbalToken };
