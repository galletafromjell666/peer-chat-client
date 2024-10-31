import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RTCPeerConnectionContextProvider } from "./common/hooks/useRTCConnectionContext.tsx";
import CreateAndJoin from "./modules/chat/components/createAndJoin/index.tsx";
import Conversation from "./modules/chat/components/conversation/index.tsx";
import ChatRootComponent from "./modules/chat/index.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <h1>some nice intro</h1>,
  },
  {
    path: "chat",
    element: <ChatRootComponent />,
    children: [
      {
        path: "create-join",
        element: <CreateAndJoin />,
      },
      {
        path: ":chatId",
        element: <Conversation />,
      },
    ],
  },
]);

function App() {
  return (
    <RTCPeerConnectionContextProvider>
      <RouterProvider router={router} />
    </RTCPeerConnectionContextProvider>
  );
}

export default App;
