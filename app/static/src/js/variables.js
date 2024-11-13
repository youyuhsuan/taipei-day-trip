export const signinDialog = document.querySelector(".signin-dialog");
export const signupDialog = document.querySelector(".signup-dialog");
export const signinForm = signinDialog.querySelector(".signin-form");
export const signupForm = signupDialog.querySelector(".signup-form");
export const signinLink = signupForm.querySelector(".signin-link");
export const signupLink = signinForm.querySelector(".signup-link");
export const loginBtn = document.querySelector(".login-btn");
export const logoutBtn = document.querySelector(".logout-btn");
export const attractionsContainer = document.querySelector(
  ".attractions-container"
);
export const listItem = document.querySelectorAll(".list-item");

export let token = localStorage.getItem("authToken");
export const booking = document.querySelector(".booking");
