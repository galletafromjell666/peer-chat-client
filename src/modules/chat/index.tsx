import { Outlet } from "react-router-dom";
import { useRTCAndSocketIOEvents } from "../../common/hooks/useRTCAndSocketIOEvents";
import { SocketIOProvider } from "../../common/hooks/useSocketIO";
import { RTCPeerConnectionContextProvider } from "../../common/hooks/useRTCConnectionContext";

const ChatRootComponent = () => {
  useRTCAndSocketIOEvents();
  return (
    <SocketIOProvider>
      <RTCPeerConnectionContextProvider>
        <Outlet />
      </RTCPeerConnectionContextProvider>
    </SocketIOProvider>
  );
};

export default ChatRootComponent;
