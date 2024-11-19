import { useSocketIoClientContextValue } from "./useSocketIOContextValue";

export function useSocketIOConfigActions() {
  const { setConfig } = useSocketIoClientContextValue();

  const joinRoom = (roomId: string) => {
    setConfig({
      query: {
        roomId,
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
