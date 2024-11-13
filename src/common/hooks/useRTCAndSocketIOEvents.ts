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

    const addMediaTracks = async () => {
      console.log("trying to add mediatracks!!");
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

    const startWebRTC = async (offerData = null, iceCandidates = []) => {
      peerConnectionRef.current = new RTCPeerConnection(peerConfiguration);
      // TODO: move to the caller?
      dataChannelRef.current =
        peerConnectionRef.current.createDataChannel("chat");

      // Configure data channel events
      dataChannelRef.current.onmessage = onChannelMessage;
      dataChannelRef.current.onopen = onChannelOpen;
      dataChannelRef.current.onclose = onChannelClose;
      dataChannelRef.current.onerror = onChannelError;

      peerConnectionRef.current.onnegotiationneeded = async (e) => {
        console.warn("negotiation needed!!", e);
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        console.log("Sending new offer to signaling server", offer);

        // Send 'webrtc-negotiation' event with the new offer
        socketIOClient.send("negotiation", offer);
      };

      peerConnectionRef.current.ondatachannel = (e) => {
        console.log("Data channel event received");
        const receiveChannel = e.channel;
        receiveChannel.onmessage = onChannelMessage;
        receiveChannel.onopen = onChannelOpen;
        receiveChannel.onclose = onChannelClose;
        receiveChannel.onerror = onChannelError;
      };

      peerConnectionRef.current.onicecandidate = (e) => {
        if (e.candidate) {
          console.log("Sending ICE candidate to signaling server", e.candidate);
          socketIOClient.send("send-candidate-to-signaling", e.candidate);
        }
      };

      if (offerData) {
        // If offer data is available, treat this as a callee and answer
        console.log("Received offer, setting remote description");
        await peerConnectionRef.current.setRemoteDescription(offerData);

        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);

        iceCandidates.forEach(async (c) => {
          console.log("Adding ICE candidate", c);
          await peerConnectionRef.current.addIceCandidate(c);
        });

        console.log("Sending answer");
        socketIOClient.send("negotiation", answer);
      } else {
        // Otherwise, initiate the offer
        console.log("Creating and sending offer");
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        socketIOClient.send("negotiation", offer);
      }

      // addMediaTracks();
    };

    const handleInitEvent = (data: any) => {
      console.log("Received init", data);
      startWebRTC(data?.offer, data?.iceCandidates);
    };

    socketIOClient.subscribe("init", handleInitEvent);

    const handleNegotiation = async (data: RTCSessionDescriptionInit) => {
      const peerConnection = peerConnectionRef.current;
      const { type } = data;

      if (type === "offer") {
        console.log("received OFFER from signaling")
        // Rollback if necessary before setting a new offer
        if (peerConnection.signalingState !== "stable") {
          console.log("Rollback before setting new offer");
          await peerConnection.setLocalDescription({ type: "rollback" });
        }

        console.log("Setting received offer as remote description");
        await peerConnection.setRemoteDescription(data);

        // Create and send an answer
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        console.log("Sending answer to signaling server");
        socketIOClient.send("negotiation", answer);
      } else if (type === "answer") {
        if (peerConnection.signalingState === "have-local-offer") {
          console.log("received ANSWER from signaling")
          await peerConnection.setRemoteDescription(data);
        } else {
          console.warn("Unexpected answer state, discarding.");
        }
      }
    };

    socketIOClient.on("negotiation", handleNegotiation);

    // receive candidate
    const handleReceiveCandidate = async (data: any) => {
      console.log(
        "Received ICE candidate from signaling server",
        data.usernameFragment
      );
      try {
        await peerConnectionRef.current.addIceCandidate(data);
        console.log("ICE candidate added", data.usernameFragment);
      } catch (error) {
        console.error("an error ocurred adding ICE candidate", error);
      }
    };

    socketIOClient.subscribe("receive-candidate", handleReceiveCandidate);

    // receive answer
    // const handleReceiveAnswer = async (data: any) => {
    //    if (peerConnectionRef.current.signalingState === "have-local-offer") {
    //       console.log("received ANSWER from signaling")
    //       await peerConnectionRef.current.setRemoteDescription(data);
    //     } else {
    //       console.warn("Unexpected answer state, discarding.");
    //     }
    // };
    // socketIOClient.subscribe("receive-answer", handleReceiveAnswer);

    return () => {
      console.log("unsubscribe!");
    };
  }, [socketIOClient]);
}
