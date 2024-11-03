import { loginBtn, logoutBtn } from "../variables.js";
import { switchAuthButton } from "./switchAuthButton.js";

function switchLogout() {
  localStorage.removeItem("authToken");
  switchAuthButton(loginBtn, logoutBtn, false);
  location.reload();
}

function switchLogoutAndRedirect() {
  switchAuthButton(loginBtn, logoutBtn, false);
  localStorage.removeItem("authToken");
  window.location.href = "/";
}

export { switchLogout, switchLogoutAndRedirect };
