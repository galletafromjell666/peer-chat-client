import { socketIoContext } from "../contexts/socketIOContext";
import { useSocketIo } from "../hooks/useSocketIO";

export function SocketIOProvider({ children }: { children?: React.ReactNode }) {
  const { client, setConfig } = useSocketIo();
  return (
    <socketIoContext.Provider value={{ client, setConfig }}>
      {children}
    </socketIoContext.Provider>
  );
}
