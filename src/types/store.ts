import { PeerChatMessage, PeerChatUser } from ".";

export interface AppState {
  isPeerConnected: boolean;
  isSmallScreenNoticeOpen: boolean;
  areNotificationsEnabled: boolean;
  preferredAudioInput: string;
  preferredAudioOutput: string;
  preferredVideoInput: string;
  isSendingFile: boolean;
  messages: PeerChatMessage[];
  users: PeerChatUser[];
}

export type AppStateActions = {
  toggleNotifications: () => void;
  updateIsPeerConnected: (isPeerConnected: boolean) => void;
  updateIsSmallScreenNoticeOpen: (isSmallScreenNoticeOpen: boolean) => void;
  updatePreferredVideoInput: (preferredVideoInput: string) => void;
  updatePreferredAudioOutput: (preferredAudioOutput: string) => void;
  updatePreferredAudioInput: (preferredAudioInput: string) => void;
  updateIsSendingFile: (isSendingFile: boolean) => void;
  addMessage: (message: PeerChatMessage) => void;
  updateMessage: (id: string, message: Partial<PeerChatMessage>) => void;
  addUser: (user: PeerChatUser) => void;
  updateUser: (id: string, newUser: Partial<PeerChatUser>) => void;
};

export type Store = AppState & {
  actions: AppStateActions;
};
