export interface PeerChatUser {
  id: string; // same as socket.io id
  name: string;
}

export interface PeerChatMessage {
  id: string;
  message: string;
  originatorId: string;
  timestamp: number;
}

export interface PeerChatDataChannelMessage {
  payload: unknown;
  originatorId: string;
  timestamp: number;
  action: string;
}
