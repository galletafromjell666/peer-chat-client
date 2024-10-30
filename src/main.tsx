import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RTCPeerConnectionContextProvider } from "./common/hooks/useRTCConnectionContext.tsx";
import { SocketIOProvider } from "./common/hooks/useSocketIO.tsx";
import App from "./App.tsx";
import "./index.css";
import CreateAndJoin from "./modules/createAndJoin/index.tsx";
import Chat from "./modules/chat/index.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <SocketIOProvider>
        <RTCPeerConnectionContextProvider>
          <App />
        </RTCPeerConnectionContextProvider>
      </SocketIOProvider>
    ),
  },
  {
    path: "/chat/create-join",
    element: <CreateAndJoin />,
  },
  {
    path: "/chat/:chatId",
    element: <Chat />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
