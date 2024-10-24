import { createContext, createRef, useContext } from "react";

const RTCPeerConnectionContext = createContext({});
const peerConnectionRef = createRef();

export const RTCPeerConnectionContextProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  return (
    <RTCPeerConnectionContext.Provider value={peerConnectionRef}>
      {children}
    </RTCPeerConnectionContext.Provider>
  );
};

export const useRTCPeerConnectionContext = () =>
  useContext(RTCPeerConnectionContext);
