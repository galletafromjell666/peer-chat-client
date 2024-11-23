export interface PeerChatUser {
  id: string; // same as socket.io id
  name: string;
}

export interface PeerChatFileData {
  status: "start" | "error" | "complete";
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
}

export interface PeerChatMessage {
  id: string;
  message: string;
  originatorId: string;
  timestamp: number;
  isReceived?: boolean;
  fileData?: PeerChatFileData;
}

export interface PeerChatMessagePayload {
  id: string;
  message: string;
}

export interface PeerChatDataChannelMessage {
  payload: Partial<PeerChatFileData> | PeerChatMessagePayload;
  originatorId: string;
  timestamp: number;
  action: string;
}
