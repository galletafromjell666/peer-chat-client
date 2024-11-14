import { useEffect, useRef } from "react";
import { useStoreActions } from "@common/store";
import { getDataDownloadUrl } from "@common/utils/files";
import {
  transformDataChannelFileMessagesToPeerChatMessage,
  transformDataChannelMessageToPeerChatMessage,
} from "@common/utils/messaging";
import {
  PeerChatDataChannelMessage,
  PeerChatFileData,
} from "@peer-chat-types/index";

import { useRTCPeerConnectionContextValue } from "./useRTCConnectionContextValue";
import { useSocketIoClientContextValue } from "./useSocketIOContextValue";

const peerConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
    },
  ],
};

export function useRTCAndSocketIOEvents() {
  const { addMessage, updateMessage } = useStoreActions();
  const { client: socketIOClient } = useSocketIoClientContextValue();
  const { peerConnectionRef, dataChannelRef } =
    useRTCPeerConnectionContextValue();

  const isPoliteRef = useRef(false);
  const inComingFile = useRef<any>({});
  const chunks = useRef<any>([]);
  const receivedSize = useRef<any>(0);

  const handleMessageChannelMessage = (
    RTCMessage: PeerChatDataChannelMessage
  ) => {
    console.log("message!", RTCMessage);
    const { action, payload } = RTCMessage;
    if (action === "message") {
      // this event has a message in its payload!
      const peerChatMessage = transformDataChannelMessageToPeerChatMessage(
        RTCMessage,
        socketIOClient!
      );
      console.log("adding message to store", peerChatMessage);
      addMessage(peerChatMessage);
    } else if (action === "start") {
      inComingFile.current = payload;
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

      const url = getDataDownloadUrl(fileData, inComingFile.current.type);

      const updatedMessageWithUrl = {
        fileData: { url, status: "complete" } as PeerChatFileData,
      };
      console.log("message with url", updatedMessageWithUrl);

      updateMessage(fileId, updatedMessageWithUrl);
    }
  };

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
      console.log("Data channel message", e);
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
        console.log("increasing receivedSize", {
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

      // TODO: Add handlers
    };

    // 1. We receive init! it has data, like if we are polite :)
    const handleInitEvent = (data: any) => {
      console.log(
        "received init event from the signaling server, creating peer connection...",
        data
      );
      isPoliteRef.current = data.isPolite;
      peerConnectionRef.current = new RTCPeerConnection(peerConfiguration);
      // TODO: move to the caller?
      dataChannelRef.current =
        peerConnectionRef.current.createDataChannel("chat");

      // Configure data channel events
      dataChannelRef.current.onmessage = onChannelMessage;
      dataChannelRef.current.onopen = onChannelOpen;
      dataChannelRef.current.onclose = onChannelClose;
      dataChannelRef.current.onerror = onChannelError;

      peerConnectionRef.current.ondatachannel = (e) => {
        console.log("Data channel event received");
        const receiveChannel = e.channel;
        receiveChannel.onmessage = onChannelMessage;
        receiveChannel.onopen = onChannelOpen;
        receiveChannel.onclose = onChannelClose;
        receiveChannel.onerror = onChannelError;
      };

      peerConnectionRef.current.onnegotiationneeded = async (e) => {
        console.warn("Negotiation is needed", e);
        // Sets the appropriate description based on the current signalingState
        await peerConnectionRef.current.setLocalDescription();
        // Send 'negotiation' event with the new offer
        console.log("sending negotiation to signaling (offer i guess)");
        socketIOClient.send(
          "negotiation",
          peerConnectionRef.current.localDescription
        );
      };

      peerConnectionRef.current.onicecandidate = (e) => {
        if (e.candidate) {
          console.log("Sending ICE candidate to signaling server", e.candidate);
          socketIOClient.send("send-candidate-to-signaling", e.candidate);
        }
      };
    };

    socketIOClient.subscribe("init", handleInitEvent);

    const handleReceiveNegotiation = async (data: any) => {
      console.log(`Received  ${data.type}  from the signaling server`);

      const offerCollision =
        data.type === "offer" &&
        peerConnectionRef.current.signalingState !== "stable";

      if (!isPoliteRef.current && offerCollision) {
        console.warn(
          "Offer collision, this impolite peer is ignoring this offer"
        );
        return;
      }

      await peerConnectionRef.current.setRemoteDescription(data);
      if (data.type === "offer") {
        console.log(
          "Received an offer, accepted it and sending a answer to signaling"
        );
        await peerConnectionRef.current.setLocalDescription();
        socketIOClient.send(
          "negotiation",
          peerConnectionRef.current.localDescription
        );
      }
    };

    socketIOClient.subscribe("receive-negotiation", handleReceiveNegotiation);

    // receive candidate
    const handleReceiveCandidate = async (data: any[] = []) => {
      console.log("Received ICE candidate from signaling server", data.length);
      try {
        data.forEach(async (c) => {
          console.log("Adding ICE candidate", c);
          await peerConnectionRef.current.addIceCandidate(c);
        });
      } catch (error) {
        console.error("an error ocurred adding ICE candidate", error);
      }
    };

    socketIOClient.subscribe("receive-candidate", handleReceiveCandidate);

    const addMediaTracks = async () => {
      console.log("trying to add media tracks!!");
      try {
        // Request access to media devices
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        console.log("Got media stream:", stream);

        // Attach tracks to the peer connection
        stream.getTracks().forEach((track) => {
          console.log("Adding track:", track);
          peerConnectionRef.current.addTrack(track, stream);
        });

        // TODO: Place it on a ref
        // localVideo.srcObject = stream;
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    return () => {
      console.log("useRTCAndSocketIOEvents clean up");
    };
  }, [socketIOClient]);
}
