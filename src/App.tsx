import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CreateAndJoin from "./modules/chat/components/createAndJoin/index.tsx";
import Conversation from "./modules/chat/components/conversation/index.tsx";
import ChatRootComponent from "./modules/chat/index.tsx";
import Invalid from "./modules/chat/components/invalid/index.tsx";

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
      {
        path: ":chatId/invalid",
        element: <Invalid />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
