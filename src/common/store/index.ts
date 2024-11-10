import { PeerChatMessage, PeerChatUser } from "@peer-chat-types/index";
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
    addUser: (user: PeerChatUser) =>
      set((s) => ({
        users: s.users.concat(user),
      })),
    updateUser: (id: string, user: PeerChatUser) =>
      set((s) => ({
        users: s.users.filter((user) => user.id === id).concat(user),
      })),
  },
}));

export const useStoreActions = () => useStore((state) => state.actions);
export const useMessages = () => useStore((state) => state.messages);
export const useUsers = () => useStore((state) => state.users);
