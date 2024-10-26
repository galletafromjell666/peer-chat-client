import { createContext, useContext } from "react";
import SocketIoClient from "../utils/socketIOInstance";

// Uses the socketIO instance from utils
export function useSocketIo() {
  const config = {
    url: "https://localhost:3600/",
  };

  const client = new SocketIoClient(config);

  client.on("connect", () => {
    console.log("Socket.io client connected");
  });

  client.on("disconnect", () => {
    console.log("Socket.io client disconnected");
  });

  return client;
}

// Creates a new context for the socketIO instance
const socketIoContext = createContext({});

export const useSocketIoClient = () => {
  return useContext(socketIoContext);
};

export function SocketIOProvider({ children }: { children?: React.ReactNode }) {
  const client = useSocketIo();
  return (
    <socketIoContext.Provider value={client}>
      {children}
    </socketIoContext.Provider>
  );
}
