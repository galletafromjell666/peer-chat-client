import { useSocketIoClient } from "./useSocketIOContextValue";

export function useSocketIOConfigActions() {
  const { setConfig } = useSocketIoClient();

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
