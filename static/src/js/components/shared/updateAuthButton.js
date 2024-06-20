async function updateAuthButton() {
  let loginBtn = document.querySelector(".login-btn");
  let logoutBtn = document.querySelector(".logout-btn");
  let token = localStorage.getItem("authToken");
  if (token) {
    const response = await fetch("/api/user/auth", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const responseDate = await response.json();
    console.log(responseDate);
  }
  loginBtn.classList.toggle("active", !token);
  logoutBtn.classList.toggle("active", token);
}

function handleLogout() {
  localStorage.removeItem("authToken");
  updateAuthButton();
  location.reload();
}
