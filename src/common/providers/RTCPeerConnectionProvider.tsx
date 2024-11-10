import { RTCPeerConnectionContext } from "@common/contexts/RTCPeerConnectionContext";
import { createRef } from "react";

const peerConnectionRef = createRef<RTCPeerConnection | null>();
const dataChannelRef = createRef<RTCDataChannel | null>();

export const RTCPeerConnectionContextProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const value = {
    peerConnectionRef,
    dataChannelRef,
  };

  return (
    <RTCPeerConnectionContext.Provider value={value}>
      {children}
    </RTCPeerConnectionContext.Provider>
  );
};
