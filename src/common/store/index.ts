import {
  PeerChatFileData,
  PeerChatMessage,
  PeerChatUser,
} from "@peer-chat-types/index";
import { AppState, Store } from "@peer-chat-types/store";
import { create } from "zustand";

const initialState: AppState = {
  messages: [],
  users: [],
};

const useStore = create<Store>((set) => ({
  ...initialState,
  actions: {
    addMessage: (message: PeerChatMessage) =>
      set((s) => ({
        messages: s.messages.concat(message),
      })),
    updateMessage: (id: string, newMessage: Partial<PeerChatMessage>) =>
      set((state) => ({
        messages: state.messages.map((message) =>
          message.id === id
            ? {
                ...message,
                ...newMessage,
                fileData: {
                  ...message.fileData,
                  ...newMessage.fileData,
                } as PeerChatFileData,
              }
            : message
        ),
      })),
    addUser: (user: PeerChatUser) =>
      set((s) => ({
        users: s.users.concat(user),
      })),
    updateUser: (id: string, newUser: Partial<PeerChatUser>) =>
      set((state) => ({
        users: state.users.map((user) =>
          user.id === id ? { ...user, ...newUser } : user
        ),
      })),
  },
}));

export const useStoreActions = () => useStore((state) => state.actions);
export const useMessages = () => useStore((state) => state.messages);
export const useUsers = () => useStore((state) => state.users);
