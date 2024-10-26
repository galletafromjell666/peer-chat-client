import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { SocketIOProvider } from "./hooks/useSocketIO.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketIOProvider>
      <App />
    </SocketIOProvider>
  </StrictMode>
);
