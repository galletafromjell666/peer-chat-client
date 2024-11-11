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

    const startWebRTC = async (offerData = null, iceCandidates = []) => {
      peerConnectionRef.current = await new RTCPeerConnection(
        peerConfiguration
      );
      console.log(peerConnectionRef, dataChannelRef);
      dataChannelRef.current =
        peerConnectionRef.current.createDataChannel("chat");

      peerConnectionRef.current.ondatachannel = (e: RTCDataChannelEvent) => {
        console.log("Callee has received a data channel event");
        const receiveChannel = e.channel;
        receiveChannel.onmessage = onChannelMessage;
        receiveChannel.onopen = onChannelOpen;
        receiveChannel.onclose = onChannelClose;
        receiveChannel.onerror = onChannelError;
      };

      // addLogs();

      peerConnectionRef.current.addEventListener(
        "icecandidate",
        (e: RTCPeerConnectionIceEvent) => {
          if (e.candidate) {
            console.log(
              "Sending ICE Candidate to signaling server",
              e.candidate
            );
            socketIOClient.send("send-candidate-to-signaling", e.candidate);
          }
        }
      );

      if (!offerData) {
        /*
        dataChannel.onopen = onChannelOpen;

        dataChannel.onclose = onChannelClose;

        dataChannel.onerror = onChannelError;

        dataChannel.onmessage = onChannelMessage;
         */

        const offer = await peerConnectionRef.current.createOffer();
        peerConnectionRef.current.setLocalDescription(offer);
        console.log("Sending offer to signaling server", offer);
        socketIOClient.send("new-offer", offer);
      }

      if (offerData) {
        console.log("Callee has received and offer");
        // Callee

        await peerConnectionRef.current.setRemoteDescription(offerData);
        const answer = await peerConnectionRef.current.createAnswer();
        peerConnectionRef.current.setLocalDescription(answer);

        iceCandidates.map(async (c) => {
          console.log("Adding init candidate", c);
          await peerConnectionRef.current.addIceCandidate(c);
        });

        console.log("Callee is emitting an answer to signaling server");
        socketIOClient.send("send-answer-to-signaling", answer);
      }
      return;
    };

    // init
    const handleInitEvent = (data: any) => {
      console.log("Received init", data);
      startWebRTC(data?.offer, data?.iceCandidates);
    };

    socketIOClient.subscribe("init", handleInitEvent);

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
    const handleReceiveAnswer = (data: any) => {
      console.log("caller has received an answer from signaling server");
      peerConnectionRef.current.setRemoteDescription(data);
    };
    socketIOClient.subscribe("receive-answer", handleReceiveAnswer);

    return () => {
      console.log("unsubscribe!");
    };
  }, [socketIOClient]);
}
