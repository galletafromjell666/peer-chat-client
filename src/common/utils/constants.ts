export const mediaDevicesErrorAccessMessage = {
  message: "Media Device Access Denied",
  description:
    "Access to your media devices is required for video conferencing. Please enable camera and microphone permissions in your browser or device settings.",
};

export const CHUNK_SIZE = 16384;

export const peerConnectionConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun3.l.google.com:19302"],
    },
  ],
};
