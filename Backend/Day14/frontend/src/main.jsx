import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import GlobalSvgDefs from "./features/shared/components/GlobalSvgDefs";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GlobalSvgDefs />
    <App />
  </StrictMode>,
);
