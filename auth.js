// auth.js

// Simple SHA-256 hashing function
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// === CONFIG ===
const PASSWORD_HASH =
  "781a214bbdbeff92f8cdd84d07aaade538be092af67ae8459588ea33241f7042";

const STORAGE_KEY = "vets_auth_ok";

// Handle login form on login.html
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) return; // not on login page

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const pwdInput = document.getElementById("password");
    const errorEl = document.getElementById("error");

    if (!pwdInput || !errorEl) return;

    errorEl.textContent = "";

    const pwd = pwdInput.value;

    try {
      const hash = await sha256(pwd);

      if (hash === PASSWORD_HASH) {
        sessionStorage.setItem(STORAGE_KEY, "1");
        // redirect to your main page
        console.log("✔ Login successful — redirecting now...");
        window.location.href = "index.html";
      } else {
        errorEl.textContent = "Incorrect password.";
      }
    } catch (err) {
      console.error(err);
      errorEl.textContent = "Something went wrong. Try again.";
    }
  });
});

// Exported helper to protect other pages
export function protectPage() {
  if (sessionStorage.getItem(STORAGE_KEY) === "1") {
    return; // already authenticated
  }

  // if not on login page, send to login
  if (!window.location.pathname.endsWith("login.html")) {
    window.location.href = "login.html";
  }
}
