import { loginBtn, logoutBtn } from "../variables.js";
import { updateAuthButton } from "../shared/updateAuthButton.js";

export function handleLogout() {
  localStorage.removeItem("authToken");
  updateAuthButton(loginBtn, logoutBtn, false);
  location.reload();
}
