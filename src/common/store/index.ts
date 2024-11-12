import {
  PeerChatFileData,
  PeerChatMessage,
  PeerChatUser,
} from "@peer-chat-types/index";
import { AppState, Store } from "@peer-chat-types/store";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const initialState: AppState = {
  isSendingFile: false,
  messages: [],
  users: [],
};

const useStore = create<Store>()(
  devtools(
    (set) => ({
      ...initialState,
      actions: {
        addMessage: (message: PeerChatMessage) =>
          set((s) => ({
            messages: s.messages.concat(message),
          })),
        updateMessage: (id: string, newMessage: Partial<PeerChatMessage>) =>
          set((s) => ({
            messages: s.messages.map((message) =>
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
        updateIsSendingFile: (isSendingFile: boolean) =>
          set(() => ({ isSendingFile })),
      },
    }),
    {
      name: "peer-chat-zustand-store",
      enabled: true,
    }
  )
);

export const useStoreActions = () => useStore((state) => state.actions);
export const useMessages = () => useStore((state) => state.messages);
export const useUsers = () => useStore((state) => state.users);
export const useIsSendingFile = () => useStore((state) => state.isSendingFile);
