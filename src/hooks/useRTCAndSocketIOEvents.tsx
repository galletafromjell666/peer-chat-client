import { useEffect } from "react";
import { useSocketIoClient } from "./useSocketIO";
import { useRTCPeerConnectionContext } from "./useRTCConnectionContext";

const peerConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
    },
  ],
};

function useRTCAndSocketIOEvents() {
  // TODO: Separate the actions and the basic listeners, so the actions can be called in any place! without causing a rerender.
  const { setConfig, client: socketIOClient } = useSocketIoClient();
  const RTCPeerConnectionRef = useRTCPeerConnectionContext();

  useEffect(() => {
    console.log("running useEffect", socketIOClient);
    if (!socketIOClient) return;

    console.log("BackgroundEvents init!", socketIOClient);

    const startWebRTC = async (offerData = null, iceCandidates = []) => {
      RTCPeerConnectionRef.current = await new RTCPeerConnection(
        peerConfiguration
      );

      /*
      const dataChannel =
        RTCPeerConnectionRef.current.createDataChannel("chat");

      RTCPeerConnectionRef.current.ondatachannel = (e) => {
        console.log("Callee has received a data channel event");
        receiveChannel = e.channel;
        receiveChannel.onmessage = onChannelMessage;
        receiveChannel.onopen = onChannelOpen;
        receiveChannel.onclose = onChannelClose;
        receiveChannel.onerror = onChannelError;
      };

      addLogs();
      
      */

      RTCPeerConnectionRef.current.addEventListener("icecandidate", (e) => {
        if (e.candidate) {
          console.log("Sending ICE Candidate to signaling server", e.candidate);
          socketIOClient.send("send-candidate-to-signaling", e.candidate);
        }
      });

      if (!offerData) {
        /*
        dataChannel.onopen = onChannelOpen;

        dataChannel.onclose = onChannelClose;

        dataChannel.onerror = onChannelError;

        dataChannel.onmessage = onChannelMessage;
         */

        const offer = await RTCPeerConnectionRef.current.createOffer();
        RTCPeerConnectionRef.current.setLocalDescription(offer);
        console.log("Sending offer to signaling server", offer);
        socketIOClient.send("new-offer", offer);
      }

      if (offerData) {
        console.log("Callee has received and offer");
        // Callee

        await RTCPeerConnectionRef.current.setRemoteDescription(offerData);
        const answer = await RTCPeerConnectionRef.current.createAnswer();
        RTCPeerConnectionRef.current.setLocalDescription(answer);

        iceCandidates.map(async (c) => {
          console.log("Adding init candidate", c);
          await RTCPeerConnectionRef.current.addIceCandidate(c);
        });

        console.log("Callee is emitting an answer to signaling server");
        socketIOClient.send("send-answer-to-signaling", answer);
      }
      return;
    };

    // init
    const handleInitEvent = (data: unknown) => {
      console.log("Received init", data);
      startWebRTC(data?.offer, data?.iceCandidates);
    };

    socketIOClient.subscribe("init", handleInitEvent);

    // receive candidate
    const handleReceiveCandidate = (data: unknown) => {
      console.log("Received ICE candidate", data);
    };

    socketIOClient.subscribe("receive-candidate", handleReceiveCandidate);

    // receive answer
    const handleReceiveAnswer = (data: unknown) => {
      console.log("Received answer", data);
    };
    socketIOClient.subscribe("receive-answer", handleReceiveAnswer);

    return () => {
      console.log("unsubscribe!");
    };
  }, [socketIOClient?.socket?.connected]);

  const joinRoom = () => {
    setConfig({
      query: {
        roomId: "11",
      },
    });
  };

  const createRoom = () => {
    setConfig({
      query: {
        action: "create",
      },
    });
  };
  return { createRoom, joinRoom };
}

export default useRTCAndSocketIOEvents;
