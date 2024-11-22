import { useStoreActions } from "@common/store";

import {
  updateMediaStreams,
  useOutgoingMediaStream,
} from "./useMediaStreamStore";
import { useRTCPeerConnectionContextValue } from "./useRTCConnectionContextValue";

function useMediaStreamActions() {
  const outgoingMediaStream = useOutgoingMediaStream();
  const { peerConnectionRef } = useRTCPeerConnectionContextValue();
  const { updatePreferredAudioInput, updatePreferredVideoInput } =
    useStoreActions();

  const updatePreferredKindDevice = (
    kind: "audio" | "video" | string,
    deviceId: string
  ) => {
    if (kind === "audio") {
      updatePreferredAudioInput(deviceId);
      return;
    }
    if (kind === "video") {
      updatePreferredVideoInput(deviceId);
    }
  };

  const getTrackByKind = (kind: "audio" | "video", stream: MediaStream) => {
    return kind === "video"
      ? stream.getVideoTracks()[0]
      : stream.getAudioTracks()[0];
  };

  const addMediaStreamToRTCConnection = async () => {
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
        updatePreferredKindDevice(
          track.kind,
          track.getCapabilities().deviceId!
        );
      });

      peerConnection.restartIce();
      updateMediaStreams({ outgoing: stream });
    } catch (error) {
      console.error("Error accessing media devices:", error);
      return { status: "error" };
    }
  };

  const removeMediaStreamToRTCConnection = () => {
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

  const updateMediaStreamTrackEnableValue = (
    kind: "audio" | "video",
    value: boolean
  ) => {
    const peerConnection = peerConnectionRef.current;
    const senders = peerConnection.getSenders();

    senders.forEach((sender) => {
      if (sender.track && sender.track.kind === kind) {
        console.log("changing track", sender.track, " enabled to ", value);
        sender.track.enabled = value;
      }
    });
  };

  const replaceTrackFromMediaStream = async (
    kind: "audio" | "video",
    deviceId: string
  ) => {
    const peerConnection = peerConnectionRef.current;
    console.log(`Changing ${kind} track to use the ${deviceId}`);

    const constraints =
      kind === "video"
        ? { video: { deviceId: { exact: deviceId } } }
        : { audio: { deviceId: { exact: deviceId } } };

    const newStream = await navigator.mediaDevices.getUserMedia(
      constraints as unknown as MediaStreamConstraints
    );

    const newTrack = getTrackByKind(kind, newStream);

    const sender = peerConnection
      .getSenders()
      .find((s) => s.track && s.track.kind === kind);

    // Replacing track on remote peer connection
    await sender!.replaceTrack(newTrack);
    updatePreferredKindDevice(kind, deviceId);
    // Replacing track on local peer connection
    const oldTrack = getTrackByKind(kind, outgoingMediaStream!);
    oldTrack?.stop();
    outgoingMediaStream?.removeTrack(oldTrack);
    outgoingMediaStream?.addTrack(newTrack);

    // updateMediaStreams({ outgoing: newStream });
  };

  return {
    addMediaStreamToRTCConnection,
    removeMediaStreamToRTCConnection,
    updateMediaStreamTrackEnableValue,
    replaceTrackFromMediaStream,
  };
}

export default useMediaStreamActions;
