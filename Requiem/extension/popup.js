const API_BASE = process.env.NODE_ENV === "production" 
  ? "https://yourdomain.com/api/v1"
  : "http://localhost:8000/api/v1";
// ─── Screen management ────────────────────────────────────────────────────────

const screens = {
  loading:   document.getElementById("screen-loading"),
  auth:      document.getElementById("screen-auth"),
  main:      document.getElementById("screen-main"),
  success:   document.getElementById("screen-success"),
  error:     document.getElementById("screen-error"),
  duplicate: document.getElementById("screen-duplicate"),
};

const showScreen = (name) => {
  Object.values(screens).forEach((s) => s.classList.add("hidden"));
  screens[name].classList.remove("hidden");
};

// ─── API helpers ──────────────────────────────────────────────────────────────

const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include", // sends cookies automatically
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
};

// ─── Main flow ────────────────────────────────────────────────────────────────

const init = async () => {
  showScreen("loading");

  // 1. Check if user is logged in
  const { ok, data: meData } = await apiFetch("/auth/me");

  if (!ok) {
    showScreen("auth");
    return;
  }

  const user = meData.data;

  // 2. Get current tab info
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // 3. Show main screen
  document.getElementById("user-name").textContent = user.name;
  document.getElementById("page-title").textContent = tab.title || tab.url;
  document.getElementById("page-url").textContent = tab.url;

  // Set favicon
  const faviconEl = document.getElementById("page-favicon");
  if (tab.favIconUrl) {
    faviconEl.src = tab.favIconUrl;
    faviconEl.onerror = () => faviconEl.style.display = "none";
  } else {
    faviconEl.style.display = "none";
  }

  showScreen("main");

  // 4. Save button handler
  document.getElementById("btn-save").addEventListener("click", async () => {
    const note = document.getElementById("note-input").value.trim();
    const btn = document.getElementById("btn-save");

    btn.disabled = true;
    btn.textContent = "Saving...";

    const { ok, status, data } = await apiFetch("/saves", {
      method: "POST",
      body: JSON.stringify({ url: tab.url, note }),
    });

    if (ok) {
      showScreen("success");
      return;
    }

    // Handle duplicate URL
    if (status === 409) {
      showScreen("duplicate");
      return;
    }

    // Other error
    document.getElementById("error-msg").textContent =
      data?.message || "Something went wrong. Please try again.";
    showScreen("error");
  });
};

// ─── Button listeners ─────────────────────────────────────────────────────────

document.getElementById("btn-open-app").addEventListener("click", () => {
  chrome.tabs.create({ url: "http://localhost:5173" });
  window.close();
});

document.getElementById("btn-close-success").addEventListener("click", () => {
  window.close();
});

document.getElementById("btn-close-duplicate").addEventListener("click", () => {
  window.close();
});

document.getElementById("btn-retry").addEventListener("click", () => {
  init();
});

// ─── Start ────────────────────────────────────────────────────────────────────

init();
