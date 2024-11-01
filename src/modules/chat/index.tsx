import { Outlet } from "react-router-dom";
import { useRTCAndSocketIOEvents } from "../../common/hooks/useRTCAndSocketIOEvents";
import { SocketIOProvider } from "../../common/providers/SocketIOClientProvider";
import { RTCPeerConnectionContextProvider } from "../../common/providers/RTCPeerConnectionContext";

export const ChatOutletSocketIOEvents = () => {
  useRTCAndSocketIOEvents();
  return <Outlet />;
};

const ChatRootComponent = () => {
  return (
    <SocketIOProvider>
      <RTCPeerConnectionContextProvider>
        <ChatOutletSocketIOEvents />
      </RTCPeerConnectionContextProvider>
    </SocketIOProvider>
  );
};

export default ChatRootComponent;
