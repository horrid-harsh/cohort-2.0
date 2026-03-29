
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
    const origin = new URL(API_BASE).origin;
    console.log("🔍 [Extension] Checking origin:", origin);
    const cookie = await chrome.cookies.get({ url: origin, name: "accessToken" });
    return cookie ? cookie.value : null;
  } catch (e) {
    console.error("❌ [Extension] Cookie error:", e.message);
    return null;
  }
};

// ─── API helpers ──────────────────────────────────────────────────────────────

const apiFetch = async (path, options = {}) => {
  try {
    const token = await getToken();
    console.log(`🌐 [Extension] Fetching: ${path}`, token ? "(With Token)" : "(No Token)");
    
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    
    const data = await res.json().catch(() => ({}));
    console.log(`📡 [Extension] Response [${res.status}]:`, data);
    
    return { ok: res.ok, status: res.status, data };
  } catch (error) {
    console.error("❌ [Extension] API error:", error);
    return { ok: false, status: 500, data: { message: "Network error" } };
  }
};

// ─── Main flow ────────────────────────────────────────────────────────────────

const init = async () => {
  console.log("🚀 [Extension] Initializing...");
  showScreen("loading");

  let { ok, data: meData } = await apiFetch("/auth/me");

  if (!ok) {
    console.warn("⚠️ [Extension] Not logged in, trying refresh...");
    const refreshResult = await apiFetch("/auth/refresh", { method: "POST" });

    if (refreshResult.ok) {
      const retry = await apiFetch("/auth/me");
      if (!retry.ok) { showScreen("auth"); return; }
      meData = retry.data;
    } else {
      showScreen("auth");
      return;
    }
  }

  const user = meData.data; // Path to user object in ApiResponse
  console.log("👤 [Extension] User loaded:", user.name);

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  document.getElementById("user-name").textContent = user.name;
  document.getElementById("page-title").textContent = tab.title || tab.url;
  document.getElementById("page-url").textContent = tab.url;

  const faviconEl = document.getElementById("page-favicon");
  if (tab.favIconUrl) {
    faviconEl.src = tab.favIconUrl;
  } else {
    faviconEl.style.display = "none";
  }

  showScreen("main");

  document.getElementById("btn-save").addEventListener("click", async () => {
    const note = document.getElementById("note-input").value.trim();
    const btn = document.getElementById("btn-save");

    btn.disabled = true;
    btn.textContent = "Saving...";

    const { ok: saveOk, status, data } = await apiFetch("/saves", {
      method: "POST",
      body: JSON.stringify({ url: tab.url, note }),
    });

    if (saveOk) { showScreen("success"); return; }
    if (status === 409) { showScreen("duplicate"); return; }

    document.getElementById("error-msg").textContent = data?.message || "Something went wrong.";
    showScreen("error");
  });
};

// ─── Button listeners ─────────────────────────────────────────────────────────

document.getElementById("btn-open-app").addEventListener("click", () => {
  chrome.tabs.create({ url: APP_URL });
  window.close();
});

document.getElementById("btn-close-success").addEventListener("click", () => window.close());
document.getElementById("btn-close-duplicate").addEventListener("click", () => window.close());
document.getElementById("btn-retry").addEventListener("click", () => init());

init();