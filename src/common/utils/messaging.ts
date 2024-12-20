import { useStore } from "@common/store";
import {
  DataChannelMessageUserAction,
  PeerChatDataChannelMessage,
  PeerChatFileData,
  PeerChatMessage,
  PeerChatMessagePayload,
} from "@peer-chat-types/index";

import SocketIoClient from "./socketIOInstance";

export const transformDataChannelMessageToPeerChatMessage = (
  RTCMessage: PeerChatDataChannelMessage,
  socketIOClient: SocketIoClient
) => {
  const { originatorId, timestamp, payload } = RTCMessage;
  const isReceived = originatorId !== socketIOClient?.socket.id;
  const { id, message } = payload as PeerChatMessagePayload;

  const transformedMessage: PeerChatMessage = {
    id: id,
    originatorId,
    timestamp,
    message: message,
    isReceived,
  };
  return transformedMessage;
};

/**
 *
 * Takes the data from the action "start" data channel message and transforms it into an object
 * that satisfies the PeerChatMessage interface to show on the message history
 *
 * @param RTCMessage
 * @param socketIOClient
 * @returns transformedMessage
 */
export const transformDataChannelFileMessagesToPeerChatMessage = (
  RTCMessage: PeerChatDataChannelMessage,
  socketIOClient: SocketIoClient
) => {
  const { originatorId, timestamp, payload, action } = RTCMessage;
  const { id, name, type, size } = payload as PeerChatFileData;
  const isReceived = originatorId !== socketIOClient?.socket.id;
  const transformedMessage: PeerChatMessage = {
    id,
    originatorId,
    message: "",
    fileData: {
      status: action as "start",
      id,
      name,
      type,
      size,
    },
    isReceived,
    timestamp,
  };
  return transformedMessage;
};

export const requestNotificationPermission = (
  successCallback: () => void,
  errorCallback?: () => void
) => {
  Notification.requestPermission()
    .then((permission) => {
      if (permission === "granted") {
        successCallback();
        return;
      }
      // Promise resolved but no as we want it.
      errorCallback?.();
    })
    .catch((error) => {
      console.log(
        "Something wrong happened while enabling notifications",
        error
      );
      errorCallback?.();
    });
};

export const sendNewMessageNotification = () => {
  const areNotificationsEnabled = useStore.getState().areNotificationsEnabled;
  if (!areNotificationsEnabled) return;

  const title = "New Message";
  const options = {
    body: "You have a new message from a peer connection",
  };

  new Notification(title, options);
};

export const createMessageForDataChannelUserAction = (
  dataChannelMessageUserAction: DataChannelMessageUserAction
) => {
  const message: PeerChatMessage = {
    id: crypto.randomUUID() as string,
    message: `A user has ${
      dataChannelMessageUserAction === DataChannelMessageUserAction.JOIN
        ? "joined"
        : "left"
    } this chat`,
    originatorId: "",
    timestamp: Date.now(),
    action: dataChannelMessageUserAction,
  };
  return message;
};
