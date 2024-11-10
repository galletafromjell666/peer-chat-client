import { createRef } from "react";
import { RTCPeerConnectionContext } from "@common/contexts/RTCPeerConnectionContext";

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
