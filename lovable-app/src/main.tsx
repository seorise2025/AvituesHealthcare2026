import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter, MemoryRouter } from "react-router-dom";
import App from "./App";
import "./styles/site.css";

// The single-file client preview opens from disk, so it uses #/ addresses.
// Shown inside another page (a hosted preview frame), it keeps the address in memory.
const framed = (() => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
})();
const Router = import.meta.env.MODE !== "clientpreview" ? BrowserRouter : framed ? MemoryRouter : HashRouter;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
);
