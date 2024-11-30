import { MutableRefObject, useContext } from "react";
import { RTCPeerConnectionContext } from "@common/contexts/RTCPeerConnectionContext";

export const useRTCPeerConnectionContextValue = () =>
  useContext(RTCPeerConnectionContext) as {
    peerConnectionRef: MutableRefObject<RTCPeerConnection | null>;
    dataChannelRef: MutableRefObject<RTCDataChannel | null>;
  };
