
// ─── Screen management ────────────────────────────────────────────────────────

const screens = {
  loading: document.getElementById("screen-loading"),
  auth: document.getElementById("screen-auth"),
  main: document.getElementById("screen-main"),
  success: document.getElementById("screen-success"),
  error: document.getElementById("screen-error"),
  duplicate: document.getElementById("screen-duplicate"),
};

const showScreen = (name) => {
  Object.values(screens).forEach((s) => s.classList.add("hidden"));
  screens[name].classList.remove("hidden");
};

// ─── Token helper ────────────────────────────────────────────────────────────

const getToken = async () => {
  try {
    const cookie = await chrome.cookies.get({ url: APP_URL, name: "accessToken" });
    return cookie ? cookie.value : null;
  } catch (e) {
    return null;
  }
};

// ─── API helpers ──────────────────────────────────────────────────────────────

const apiFetch = async (path, options = {}) => {
  try {
    // Manually get the token to bypass SameSite: Lax issues on localhost
    const token = await getToken();
    
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    
    let data;
    try {
      data = await res.json();
    } catch (e) {
      data = {};
    }
    
    return { ok: res.ok, status: res.status, data };
  } catch (error) {
    console.error("API error:", error);
    return { ok: false, status: 500, data: { message: "Network error" } };
  }
};

// ─── Main flow ────────────────────────────────────────────────────────────────

const init = async () => {
  showScreen("loading");

  // 1. Try /auth/me — if 401, try refresh first
  let { ok, data: meData } = await apiFetch("/auth/me");

  if (!ok) {
    // Try refreshing the token
    const refreshResult = await apiFetch("/auth/refresh", { method: "POST" });

    if (refreshResult.ok) {
      // Retry /auth/me with new cookie
      const retry = await apiFetch("/auth/me");
      if (!retry.ok) {
        showScreen("auth");
        return;
      }
      ok = retry.ok;
      meData = retry.data;
    } else {
      showScreen("auth");
      return;
    }
  }

  const user = meData.data;

  // 2. Get current tab info
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // 3. Show main screen
  document.getElementById("user-name").textContent = user.name;
  document.getElementById("page-title").textContent = tab.title || tab.url;
  document.getElementById("page-url").textContent = tab.url;

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

    if (ok) { showScreen("success"); return; }
    if (status === 409) { showScreen("duplicate"); return; }

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

document.getElementById("btn-close-success").addEventListener("click", () => window.close());
document.getElementById("btn-close-duplicate").addEventListener("click", () => window.close());
document.getElementById("btn-retry").addEventListener("click", () => init());

init();