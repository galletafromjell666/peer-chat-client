import { PeerChatMessage, PeerChatUser } from ".";

export interface AppState {
  messages: PeerChatMessage[];
  users: PeerChatUser[];
}

export type AppStateActions = {
  addMessage: (message: PeerChatMessage) => void;
  updateMessage: (id: string, message: Partial<PeerChatMessage>) => void;
  addUser: (user: PeerChatUser) => void;
  updateUser: (id: string, newUser: Partial<PeerChatUser>) => void;
};

export type Store = AppState & {
  actions: AppStateActions;
};
