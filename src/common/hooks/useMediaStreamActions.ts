import { updateMediaStreams } from "./useMediaStreamStore";
import { useRTCPeerConnectionContextValue } from "./useRTCConnectionContextValue";

function useMediaStreamActions() {
  const { peerConnectionRef } = useRTCPeerConnectionContextValue();

  const addMediaTracksToRTCConnection = async () => {
    const peerConnection = peerConnectionRef.current;

    if (!peerConnection) {
      console.error("Peer connection is not initialized.");
      return;
    }

    try {
      // Request access to media devices
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      console.log("Got media stream:", stream);

      // Attach tracks to the peer connection
      stream.getTracks().forEach((track) => {
        console.log("Adding track to peer connection:", track);
        peerConnection.addTrack(track, stream);
      });

      updateMediaStreams({ outgoing: stream });
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const removeMediaTracksToRTCConnection = () => {
    const peerConnection = peerConnectionRef.current;

    if (!peerConnection) {
      console.error("Peer connection is not initialized.");
      return;
    }

    // Get all senders (tracks sent by this peer)
    const senders = peerConnection.getSenders();

    senders.forEach((sender) => {
      console.log("Removing track:", sender.track);
      if (sender.track) {
        sender.track.stop(); // Stops the track completely
      }
      peerConnection.removeTrack(sender); // Removes the track from the connection
    });

    // Optionally clear your local media stream reference
    updateMediaStreams({ outgoing: null });
  };

  return { addMediaTracksToRTCConnection, removeMediaTracksToRTCConnection };
}

export default useMediaStreamActions;
