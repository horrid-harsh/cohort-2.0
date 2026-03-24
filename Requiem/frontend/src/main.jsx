import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.jsx";

// Loader fade-out will be handled by LiquidProgressLoader component after hydration

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
