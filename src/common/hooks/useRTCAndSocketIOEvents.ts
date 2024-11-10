import { useEffect } from "react";
import { useSocketIoClientContextValue } from "./useSocketIOContextValue";
import { useRTCPeerConnectionContextValue } from "./useRTCConnectionContextValue";
import { PeerChatDataChannelMessage } from "../../types";
import { useStoreActions } from "../store";
import { transformDataChannelMessageToPeerChatMessage } from "../utils/messaging";

const peerConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
    },
  ],
};

export function useRTCAndSocketIOEvents() {
  const { addMessage } = useStoreActions();
  const { client: socketIOClient } = useSocketIoClientContextValue();
  const { peerConnectionRef, dataChannelRef } =
    useRTCPeerConnectionContextValue();

  console.log("useRTCAndSocketIOEvents", {
    peerConnectionRef,
    dataChannelRef,
    socketIOClient,
  });

  const handleMessageChannelMessage = (
    RTCMessage: PeerChatDataChannelMessage
  ) => {
    const { action } = RTCMessage;
    if (action === "message") {
      // this event has a message in its payload!
      const peerChatMessage = transformDataChannelMessageToPeerChatMessage(
        RTCMessage,
        socketIOClient!
      );
      console.log("adding message to store", peerChatMessage);
      addMessage(peerChatMessage);
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
      const parsedData = JSON.parse(e.data) as PeerChatDataChannelMessage;
      handleMessageChannelMessage(parsedData);
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
