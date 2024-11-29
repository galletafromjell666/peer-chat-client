import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SocketIoClient, {
  SocketIOClientConfig,
} from "@common/utils/socketIOInstance";

// Uses the socketIO instance from utils
export function useSocketIo(configParams?: SocketIOClientConfig) {
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

    newClient.subscribe("invalid-handshake", (data) => {
      navigate(`/chat/${data}/invalid`);
    });

    newClient.subscribe("disconnect", () => {
      console.log("Socket.io client disconnected");
    });

    setClient(newClient);

    return () => {
      console.log("useSocketIo clean up");
      setClient(undefined)
      newClient.disconnect(); // Clean up connection on unmount
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config?.query?.roomId, config?.query?.action]);

  // Return the client and the method to update the config
  return { client: client as SocketIoClient, setConfig };
}
