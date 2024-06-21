export function updateAuthButton(loginBtn, logoutBtn, isLoggedIn) {
  loginBtn.classList.toggle("active", isLoggedIn);
  logoutBtn.classList.toggle("active", !isLoggedIn);
}
