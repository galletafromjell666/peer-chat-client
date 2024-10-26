import { useEffect } from "react";
import { useSocketIoClient } from "./useSocketIO";

function useRTCAndSocketIOEvents() {
  const { setConfig, client: socketIOClient } = useSocketIoClient();

  useEffect(() => {
    if (!socketIOClient) return;
    console.log("BackgroundEvents init!");
    const handleInitEvent = (data: unknown) => {
      console.log("Received init", data);
    };
    socketIOClient!.subscribe("init", handleInitEvent);
    return () => {};
  }, []);

  const joinRoom = () => {
    setConfig({
      query: {
        roomId: "11",
      },
    });
  };

  const createRoom = () => {
    setConfig({
      query: {
        action: "create",
      },
    });
  };
  return { createRoom, joinRoom };
}

export default useRTCAndSocketIOEvents;
