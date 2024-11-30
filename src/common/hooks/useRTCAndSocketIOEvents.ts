import { useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useStoreActions } from "@common/store";
import { peerConnectionConfiguration } from "@common/utils/constants";
import { getDataDownloadUrl } from "@common/utils/files";
import {
  createMessageForDataChannelUserAction,
  sendNewMessageNotification,
  transformDataChannelFileMessagesToPeerChatMessage,
  transformDataChannelMessageToPeerChatMessage,
} from "@common/utils/messaging";
import {
  DataChannelMessageUserAction,
  PeerChatDataChannelMessage,
  PeerChatFileData,
} from "@peer-chat-types/index";
import { isNil } from "lodash";

import { outgoingMediaStream, updateMediaStreams } from "./useMediaStreamStore";
import { useRTCPeerConnectionContextValue } from "./useRTCConnectionContextValue";
import { useSocketIoClientContextValue } from "./useSocketIOContextValue";

export function useRTCAndSocketIOEvents() {
  const params = useParams();
  const isPoliteRef = useRef(false);
  const inComingFile = useRef<File | null>(null);
  const chunks = useRef<ArrayBuffer[]>([]);
  const receivedSize = useRef<number>(0);

  const {
    addMessage,
    updateMessage,
    updateIsPeerConnected,
    resetConversationValues,
  } = useStoreActions();
  const { client: socketIOClient, setConfig } = useSocketIoClientContextValue();
  const { peerConnectionRef, dataChannelRef } =
    useRTCPeerConnectionContextValue();

  const chatId = params?.chatId;
  // hacky way to trigger a clean up when we navigate inside the same outlet
  const needsCleanUp = chatId !== undefined && Boolean(socketIOClient?.socket);

  useEffect(() => {
    return () => {
      if (needsCleanUp) {
        const peerConnection = peerConnectionRef.current;
        if (!peerConnection) return;
        console.log("useRTCAndSocketIOEvents clean up");
        setConfig?.(undefined);
        const dataChannel = dataChannelRef.current;
        // Closing and disconnecting connections

        // We remove the onclose event handler to avoid receiving a onclose event after dismounting the hook
        if (dataChannel) {
          dataChannel.onclose = null;
          dataChannel?.close();
        }

        resetConversationValues();
        // Media stuff clean up
        peerConnection.close();
        outgoingMediaStream?.getVideoTracks().forEach((t) => t?.stop());
        updateMediaStreams({ outgoing: null });
        updateMediaStreams({ incoming: null });
      }
    };
  }, [
    dataChannelRef,
    needsCleanUp,
    peerConnectionRef,
    resetConversationValues,
    setConfig,
    socketIOClient,
  ]);

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

        updateMessage(fileId!, updatedMessageWithUrl);
        sendNewMessageNotification();
      }
    },
    [addMessage, socketIOClient, updateMessage]
  );

  const handleOnChannelMessageEvent = useCallback(
    (e: MessageEvent) => {
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
    },
    [handleMessageChannelMessage]
  );

  useEffect(() => {
    if (!socketIOClient) return;

    console.log("BackgroundEvents init!", socketIOClient);

    const onChannelOpen = (e: Event) => {
      updateIsPeerConnected(true);
      addMessage(
        createMessageForDataChannelUserAction(DataChannelMessageUserAction.JOIN)
      );
      console.log("Data channel is open", e);
    };

    const onChannelClose = (e: Event) => {
      updateIsPeerConnected(false);
      addMessage(
        createMessageForDataChannelUserAction(DataChannelMessageUserAction.LEFT)
      );
      console.log("Data channel is closed", e);
    };

    const onChannelError = (e: Event) => {
      console.error("Data channel error", e);
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

    const onChannelMessage = handleOnChannelMessageEvent;

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
      await peerConnection?.setLocalDescription();
      // Send 'negotiation' event with the new offer
      console.log("Sending offer: ", peerConnection?.localDescription);
      socketIOClient.send("negotiation", peerConnection?.localDescription);
    };

    // 1. We receive init! it has data, like if we are polite :)
    const handleInitEvent = (data: { isPolite: boolean }) => {
      console.log(
        "Received init event from the signaling server, creating peer connection...",
        data
      );
      isPoliteRef.current = data.isPolite;

      // We receive init when we start a connection or the other peer has disconnected
      updateIsPeerConnected(false);

      if (!isNil(peerConnectionRef.current)) {
        console.warn("This is not the first init...");
        // We already have a RTCPeerConnection, this means that this is not the first init that we are handling

        // Right now we just care of adding an action message when we receive a subsequent init
        if (dataChannelRef.current?.readyState === "open") {
          addMessage(
            createMessageForDataChannelUserAction(
              DataChannelMessageUserAction.LEFT
            )
          );
        }
      }

      peerConnectionRef.current = new RTCPeerConnection(
        peerConnectionConfiguration
      );

      const peerConnection = peerConnectionRef.current;
      console.log("peer connection created", peerConnection);
      peerConnection.onnegotiationneeded = onNegotiationNeeded;

      peerConnection.onicecandidate = onIceCandidate;

      peerConnection.ontrack = onTrack;

      peerConnection.onsignalingstatechange = (e: Event) => {
        const { target } = e;
        console.debug(
          "Signaling state change",
          (target! as unknown as { signalingState: string }).signalingState
        );
      };

      peerConnection.onicecandidateerror = onIceCandidateError;

      // Data Channel stuff
      dataChannelRef.current = peerConnection.createDataChannel("chat", {
        negotiated: true,
        id: 0,
      });

      console.log("data channel created", dataChannelRef.current);
      dataChannelRef.current.onmessage = onChannelMessage;

      dataChannelRef.current.onopen = onChannelOpen;

      dataChannelRef.current.onclose = onChannelClose;

      dataChannelRef.current.onerror = onChannelError;
    };

    socketIOClient.subscribe("init", handleInitEvent);

    const handleReceiveNegotiation = async (
      data: RTCSessionDescriptionInit
    ) => {
      const peerConnection = peerConnectionRef.current;
      if (!peerConnection) return;
      console.log(
        `Received ${data.type} from the signaling server and my state is ${peerConnection?.signalingState}`
      );

      const offerCollision =
        data.type === "offer" && peerConnection?.signalingState !== "stable";

      if (!isPoliteRef.current && offerCollision) {
        console.warn(
          "Offer collision, this impolite peer is ignoring this offer"
        );
        return;
      }

      await peerConnection?.setRemoteDescription(data);
      if (data.type === "offer") {
        console.log(
          "Received an offer, accepted it and sending a answer to signaling"
        );
        await peerConnection?.setLocalDescription();
        socketIOClient.send("negotiation", peerConnection?.localDescription);
      }
    };

    socketIOClient.subscribe<RTCSessionDescriptionInit>(
      "receive-negotiation",
      handleReceiveNegotiation
    );

    // receive candidate
    const handleReceiveCandidate = async (data: RTCIceCandidate[] = []) => {
      const peerConnection = peerConnectionRef.current;
      if (!peerConnection) return;
      console.log("Received ICE candidate from signaling server");
      try {
        data.forEach(async (c) => {
          console.log("Adding ICE candidate", c);
          await peerConnection?.addIceCandidate(c);
        });
      } catch (error) {
        console.error("An error occurred adding ICE candidate", error);
      }
    };

    socketIOClient.subscribe<RTCIceCandidate[]>(
      "receive-candidate",
      handleReceiveCandidate
    );

    return () => {};
  }, [
    addMessage,
    dataChannelRef,
    handleMessageChannelMessage,
    handleOnChannelMessageEvent,
    peerConnectionRef,
    resetConversationValues,
    socketIOClient,
    updateIsPeerConnected,
  ]);
}
