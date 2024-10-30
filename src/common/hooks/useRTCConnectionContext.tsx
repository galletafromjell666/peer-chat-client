import { createContext, createRef, MutableRefObject, useContext } from "react";

export type RTCContextType = {
  peerConnection: MutableRefObject<RTCPeerConnection | null>;
  dataChannel: MutableRefObject<RTCDataChannel | null>;
};

const RTCPeerConnectionContext = createContext({});
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

export const useRTCPeerConnectionContext = () =>
  useContext(RTCPeerConnectionContext) as {
    peerConnectionRef: MutableRefObject<RTCPeerConnection>;
    dataChannelRef: MutableRefObject<RTCDataChannel>;
  };
