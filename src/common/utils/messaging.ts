import { PeerChatDataChannelMessage, PeerChatMessage } from "../../types";
import SocketIoClient from "./socketIOInstance";

export const transformDataChannelMessageToPeerChatMessage = (
  RTCMessage: PeerChatDataChannelMessage,
  socketIOClient: SocketIoClient
) => {
  const { originatorId, timestamp, payload } = RTCMessage;

  const transformedMessage: PeerChatMessage = {
    id: payload.id,
    originatorId,
    timestamp,
    message: payload.message,
    isReceived: originatorId !== socketIOClient?.socket.id,
  };
  return transformedMessage;
};
