import { create } from "zustand";
import { PeerChatMessage, PeerChatUser } from "../../types";
import { AppState, Store } from "../../types/store";

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