import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.jsx";

// Add this before createRoot
const loader = document.querySelector(".loader-wrapper");
if (loader) {
  loader.classList.add("fade-out");
  setTimeout(() => loader.remove(), 400); // remove after fade
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
