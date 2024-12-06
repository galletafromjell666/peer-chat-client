import { socketIoContext } from "@common/contexts/socketIOContext";
import { useSocketIO } from "@common/hooks/useSocketIO";


export function SocketIOProvider({ children }: { children?: React.ReactNode }) {
  const { client, setConfig } = useSocketIO();
  return (
    <socketIoContext.Provider value={{ client, setConfig }}>
      {children}
    </socketIoContext.Provider>
  );
}
