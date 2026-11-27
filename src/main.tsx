import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { initAccountSync } from "./lib/accountSync";
initAccountSync();
import { initNumberInputUx } from "./lib/numberInputUx";
initNumberInputUx();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
