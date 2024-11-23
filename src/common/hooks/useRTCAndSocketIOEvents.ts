import { useCallback, useEffect, useRef } from "react";
import { useStoreActions } from "@common/store";
import { getDataDownloadUrl } from "@common/utils/files";
import {
  sendNewMessageNotification,
  transformDataChannelFileMessagesToPeerChatMessage,
  transformDataChannelMessageToPeerChatMessage,
} from "@common/utils/messaging";
import {
  PeerChatDataChannelMessage,
  PeerChatFileData,
} from "@peer-chat-types/index";

import { outgoingMediaStream, updateMediaStreams } from "./useMediaStreamStore";
import { useRTCPeerConnectionContextValue } from "./useRTCConnectionContextValue";
import { useSocketIoClientContextValue } from "./useSocketIOContextValue";

const peerConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun3.l.google.com:19302"],
    },
  ],
};

export function useRTCAndSocketIOEvents() {
  const { addMessage, updateMessage } = useStoreActions();
  const { client: socketIOClient } = useSocketIoClientContextValue();
  const { peerConnectionRef, dataChannelRef } =
    useRTCPeerConnectionContextValue();

  const isPoliteRef = useRef(false);
  const inComingFile = useRef<File | null>(null);
  const chunks = useRef<ArrayBuffer[]>([]);
  const receivedSize = useRef<number>(0);

  const handleMessageChannelMessage = useCallback(
    (RTCMessage: PeerChatDataChannelMessage) => {
      const { action, payload } = RTCMessage;
      if (action === "message") {
        const peerChatMessage = transformDataChannelMessageToPeerChatMessage(
          RTCMessage,
          socketIOClient!
        );
        addMessage(peerChatMessage);
        sendNewMessageNotification();
      } else if (action === "start") {
        inComingFile.current = payload as File;
        const peerChatMessageWithFile =
          transformDataChannelFileMessagesToPeerChatMessage(
            RTCMessage,
            socketIOClient!
          );
        addMessage(peerChatMessageWithFile);
      } else if (action === "complete") {
        const fileId = payload.id;
        const fileData = new Uint8Array(receivedSize.current);
        let offset = 0;
        for (const chunk of chunks.current) {
          fileData.set(new Uint8Array(chunk), offset);
          offset += chunk.byteLength;
        }

        const url = getDataDownloadUrl(fileData);

        const updatedMessageWithUrl = {
          fileData: { url, status: "complete" } as PeerChatFileData,
        };

        updateMessage(fileId, updatedMessageWithUrl);
        sendNewMessageNotification();
      }
    },
    [addMessage, socketIOClient, updateMessage]
  );

  useEffect(() => {
    if (!socketIOClient) return;

    console.log("BackgroundEvents init!", socketIOClient);

    const onChannelOpen = (e: Event) => {
      console.log("Data channel is open", e);
    };

    const onChannelClose = (e: Event) => {
      console.log("Data channel is closed", e);
    };

    const onChannelError = (e: Event) => {
      console.error("Data channel error", e);
    };

    const onChannelMessage = (e: MessageEvent) => {
      if (typeof e.data === "string") {
        const parsedData = JSON.parse(e.data) as PeerChatDataChannelMessage;
        handleMessageChannelMessage(parsedData);
      } else if (e.data instanceof ArrayBuffer) {
        if (!inComingFile?.current) {
          console.error("Received chunk without file info");
          return;
        }

        chunks.current.push(e.data);
        const { byteLength } = e.data;
        console.log("Increasing receivedSize", {
          byteLength,
          current: receivedSize.current,
        });
        receivedSize.current = receivedSize.current + byteLength;

        // Calculate and log progress
        const progress = (
          (receivedSize.current / inComingFile?.current?.size) *
          100
        ).toFixed(2);
        console.log(`Receive progress: ${progress}%`);
      }
    };

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

    const onIceCandidate = (e: RTCPeerConnectionIceEvent) => {
      if (e.candidate) {
        console.log("Sending ICE candidate to signaling server", e.candidate);
        socketIOClient.send("send-candidate-to-signaling", e.candidate);
      }
    };

    const onIceCandidateError = (e: RTCPeerConnectionIceErrorEvent) => {
      console.error("An error occurred with an ice candidate", e);
    };

    const onNegotiationNeeded = async () => {
      const peerConnection = peerConnectionRef.current;
      console.warn("Negotiation is needed");
      // Sets the appropriate description based on the current signalingState
      await peerConnection.setLocalDescription();
      // Send 'negotiation' event with the new offer
      console.log("Sending offer: ", peerConnection.localDescription);
      socketIOClient.send("negotiation", peerConnection.localDescription);
    };

    // 1. We receive init! it has data, like if we are polite :)
    const handleInitEvent = (data: any) => {
      console.log(
        "Received init event from the signaling server, creating peer connection...",
        data
      );
      isPoliteRef.current = data.isPolite;

      peerConnectionRef.current = new RTCPeerConnection(peerConfiguration);
      const peerConnection = peerConnectionRef.current;
      // TODO: move to the caller?
      dataChannelRef.current = peerConnection.createDataChannel("chat");

      // Configure data channel events
      dataChannelRef.current.onmessage = onChannelMessage;
      dataChannelRef.current.onopen = onChannelOpen;
      dataChannelRef.current.onclose = onChannelClose;
      dataChannelRef.current.onerror = onChannelError;

      peerConnection.ondatachannel = (e) => {
        console.log("Data channel event received");
        const receiveChannel = e.channel;
        receiveChannel.onmessage = onChannelMessage;
        receiveChannel.onopen = onChannelOpen;
        receiveChannel.onclose = onChannelClose;
        receiveChannel.onerror = onChannelError;
      };

      peerConnection.ontrack = onTrack;

      peerConnection.onnegotiationneeded = onNegotiationNeeded;

      peerConnection.onicecandidate = onIceCandidate;

      peerConnection.onicecandidateerror = onIceCandidateError;
    };

    socketIOClient.subscribe("init", handleInitEvent);

    const handleReceiveNegotiation = async (
      data: RTCSessionDescriptionInit
    ) => {
      const peerConnection = peerConnectionRef.current;
      console.log(`Received ${data.type} from the signaling server`);

      const offerCollision =
        data.type === "offer" && peerConnection.signalingState !== "stable";

      if (!isPoliteRef.current && offerCollision) {
        console.warn(
          "Offer collision, this impolite peer is ignoring this offer"
        );
        return;
      }

      await peerConnection.setRemoteDescription(data);
      if (data.type === "offer") {
        console.log(
          "Received an offer, accepted it and sending a answer to signaling"
        );
        await peerConnection.setLocalDescription();
        socketIOClient.send("negotiation", peerConnection.localDescription);
      }
    };

    socketIOClient.subscribe<RTCSessionDescriptionInit>(
      "receive-negotiation",
      handleReceiveNegotiation
    );

    // receive candidate
    const handleReceiveCandidate = async (data: RTCIceCandidate[] = []) => {
      const peerConnection = peerConnectionRef.current;
      console.log("Received ICE candidate from signaling server");
      try {
        data.forEach(async (c) => {
          console.log("Adding ICE candidate", c);
          await peerConnection.addIceCandidate(c);
        });
      } catch (error) {
        console.error("An error occurred adding ICE candidate", error);
      }
    };

    socketIOClient.subscribe<RTCIceCandidate[]>(
      "receive-candidate",
      handleReceiveCandidate
    );

    return () => {
      console.log("useRTCAndSocketIOEvents clean up");
      const peerConnection = peerConnectionRef.current;
      if (!peerConnection) return;
      // Stop outgoing video tracks to turn off camera indicator
      outgoingMediaStream?.getVideoTracks().forEach((t) => t?.stop());
      updateMediaStreams({ outgoing: null });
      const dataChannel = dataChannelRef.current;
      // Closing and disconnecting connections
      peerConnection.close();
      dataChannel?.close();
      socketIOClient.disconnect();
    };
  }, [
    dataChannelRef,
    handleMessageChannelMessage,
    peerConnectionRef,
    socketIOClient,
  ]);
}
