import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // Note: You'll need an index.css for global styles
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
