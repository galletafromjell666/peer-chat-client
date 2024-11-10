import { socketIoContext } from "@common/contexts/socketIOContext";
import { useSocketIo } from "@common/hooks/useSocketIO";


export function SocketIOProvider({ children }: { children?: React.ReactNode }) {
  const { client, setConfig } = useSocketIo();
  return (
    <socketIoContext.Provider value={{ client, setConfig }}>
      {children}
    </socketIoContext.Provider>
  );
}
