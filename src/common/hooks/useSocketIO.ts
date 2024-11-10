import SocketIoClient from "@common/utils/socketIOInstance";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Uses the socketIO instance from utils
export function useSocketIo(configParams?: any) {
  const navigate = useNavigate();
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

    newClient.subscribe("connect", () => {
      console.log("Socket.io client connected");
    });

    newClient.subscribe("new-room", (data) => {
      console.log(`Room created ${data} navigating to it`);
      navigate(`/chat/${data}`);
    });

    newClient.subscribe("disconnect", () => {
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

