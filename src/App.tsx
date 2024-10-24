import { useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3500", {
  transports: ["websocket"], // Required when using Vite
});

const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

function App() {
  const localPeerConnection = useRef<RTCPeerConnection | null>(null);
  const remotePeerConnection = useRef<RTCPeerConnection | null>(null);

  function sendMessage() {
    console.log("Button clicked");
    socket.emit("send_message", { message: "Hello from client" });
  }
  useEffect(() => {
    localPeerConnection.current = new RTCPeerConnection();
    remotePeerConnection.current = new RTCPeerConnection();

    // socktio signaling

    localPeerConnection.current.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socket.emit("ice-candidate", candidate);
      }
    };

    socket.on("ice-candidate", (candidate) => {
      remotePeerConnection.current!.addIceCandidate(candidate);
    });

    function createOffer() {
      localPeerConnection.current!.createOffer().then((offer) => {
        localPeerConnection.current!.setLocalDescription(offer);
        console.log(offer);
        socket.emit("offer", offer);
      });
    }

    socket.on("offer", (offer) => {
      remotePeerConnection.current!.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      remotePeerConnection.current!.createAnswer().then((answer) => {
        remotePeerConnection.current!.setLocalDescription(answer);
        socket.emit("answer", answer);
      });
    });

    socket.on("answer", (answer) => {
      localPeerConnection.current!.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    // socketio stuff
    socket.emit("connection");
  }, []);

  return (
    <div>
      <h1>peer-chat-client!</h1>
      <input placeholder="Message" />
      <button onClick={sendMessage}>Send message</button>
    </div>
  );
}

export default App;
