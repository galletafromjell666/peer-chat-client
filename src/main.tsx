import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RTCPeerConnectionContextProvider } from "./hooks/useRTCConnectionContext.tsx";
import { SocketIOProvider } from "./hooks/useSocketIO.tsx";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketIOProvider>
      <RTCPeerConnectionContextProvider>
        <App />
      </RTCPeerConnectionContextProvider>
    </SocketIOProvider>
  </StrictMode>
);
