import { loginBtn, logoutBtn } from "../variables.js";
import { updateAuthButton } from "../page/updateAuthButton.js";

function handleLogout() {
  localStorage.removeItem("authToken");
  updateAuthButton(loginBtn, logoutBtn, false);
  location.reload();
}

export { handleLogout };
