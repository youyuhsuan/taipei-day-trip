import { loginBtn, logoutBtn } from "../variables.js";
import { updateAuthButton } from "../page/updateAuthButton.js";

function handleLogout() {
  localStorage.removeItem("authToken");
  updateAuthButton(loginBtn, logoutBtn, false);
  location.reload();
}

function handleLogoutAndRedirect() {
  updateAuthButton(loginBtn, logoutBtn, false);
  localStorage.removeItem("authToken");
  window.location.href = "/";
}

export { handleLogout, handleLogoutAndRedirect };
