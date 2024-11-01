import { MutableRefObject, useContext } from "react";
import { RTCPeerConnectionContext } from "../contexts/RTCPeerConnectionContext";

export const useRTCPeerConnectionContextValue = () =>
  useContext(RTCPeerConnectionContext) as {
    peerConnectionRef: MutableRefObject<RTCPeerConnection>;
    dataChannelRef: MutableRefObject<RTCDataChannel>;
  };
