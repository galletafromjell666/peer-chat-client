import { useEffect } from "react";

import { outgoingMediaStream, updateMediaStreams } from "./useMediaStreamStore";
import { useRTCPeerConnectionContextValue } from "./useRTCConnectionContextValue";

function useRTCConnectionMediaStreamEvents() {
  const { peerConnectionRef } = useRTCPeerConnectionContextValue();
  useEffect(() => {
    const peerConnection = peerConnectionRef.current;
    if (!peerConnection) return;

    const onTrack = (e: RTCTrackEvent) => {
      if (e.streams) {
        console.log("Received media stream:", e);

        e.track.onended = () => {
          console.log("Track ended:", e.track);
          stream.removeTrack(e.track);
        };

        const stream = e.streams[0];
        stream.onremovetrack = () => {
          console.log("Incoming track removed", e);
          if (stream.getTracks().length === 0) {
            console.log("All tracks removed. Resetting incoming stream.");
            updateMediaStreams({ incoming: null });
          }
        };

        updateMediaStreams({ incoming: e.streams[0] });
      }
    };

    peerConnection.ontrack = onTrack;

    return () => {
console.log("clean up useRTCMEdiaStream")
      // Stop outgoing video tracks to turn off camera indicator
      outgoingMediaStream?.getVideoTracks().forEach((t) => t?.stop());
      updateMediaStreams({ outgoing: null });
    };
  }, [peerConnectionRef]);
}

export default useRTCConnectionMediaStreamEvents;
