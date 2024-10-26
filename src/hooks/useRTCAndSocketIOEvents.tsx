import { useEffect } from "react";
import { useSocketIoClient } from "./useSocketIO";

function useRTCAndSocketIOEvents() {
  const { setConfig, client: socketIOClient } = useSocketIoClient();

  useEffect(() => {
    if (!socketIOClient) return;
    console.log("BackgroundEvents init!");

    // init
    const handleInitEvent = (data: unknown) => {
      console.log("Received init", data);
    };

    socketIOClient.subscribe("init", handleInitEvent);

    // receive candidate
    const handleReceiveCandidate = (data: unknown) => {
      console.log("Received ICE candidate", data);
    };

    socketIOClient.subscribe("receive-candidate", handleReceiveCandidate);

    // receive answer
    const handleReceiveAnswer = (data: unknown) => {
      console.log("Received answer", data);
    };
    socketIOClient.subscribe("receive-answer", handleReceiveAnswer);

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
