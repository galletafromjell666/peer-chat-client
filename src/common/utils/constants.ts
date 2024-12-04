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

export const getServerStatusMessages = (isSuccess: boolean) => {
  if (isSuccess) {
    return {
      title: "PeerChat server is up and running.",
      subTitle: " All systems are operational. Ready to connect securely.",
    };
  }
  return {
    title: "PeerChat server is currently unavailable.",
    subTitle: "Please try again later or check your connection settings.",
  };
};
