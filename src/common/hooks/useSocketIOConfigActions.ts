import { useSocketIoClientContextValue } from "./useSocketIOContextValue";

export function useSocketIOConfigActions() {
  const { setConfig } = useSocketIoClientContextValue();

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
