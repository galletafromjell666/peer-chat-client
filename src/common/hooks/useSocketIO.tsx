import { createContext, useContext, useEffect, useState } from "react";
import SocketIoClient from "../utils/socketIOInstance";

// Uses the socketIO instance from utils
export function useSocketIo(configParams?: any) {
  const [config, setConfig] = useState(configParams);
  const [client, setClient] = useState<SocketIoClient>();

  useEffect(() => {
    const isConfigValid = config?.query?.action || config?.query?.roomId;
    if (!isConfigValid) {
      // Invalid config to create a new SocketIO Client instance
      return;
    }

    console.log("creating new SocketIO client with config: ", config);
    const newClient = new SocketIoClient(config);

    newClient.on("connect", () => {
      console.log("Socket.io client connected");
    });

    newClient.on("disconnect", () => {
      console.log("Socket.io client disconnected");
    });

    setClient(newClient);

    return () => {
      newClient.disconnect(); // Clean up connection on unmount
    };
  }, [config?.query?.roomId, config?.query?.action]);

  // Return the client and the method to update the config
  return { client: client as SocketIoClient, setConfig };
}

// Creates a new context for the socketIO instance
const socketIoContext = createContext<{
  client: SocketIoClient | null;
  setConfig: any;
}>({ client: null, setConfig: null });

export function useSocketIoClient() {
  return useContext(socketIoContext);
}

export function SocketIOProvider({ children }: { children?: React.ReactNode }) {
  const { client, setConfig } = useSocketIo();
  return (
    <socketIoContext.Provider value={{ client, setConfig }}>
      {children}
    </socketIoContext.Provider>
  );
}
