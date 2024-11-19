import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocketIOConfigActions } from "@common/hooks/useSocketIOConfigActions";
import { useSocketIoClientContextValue } from "@common/hooks/useSocketIOContextValue";
import { Flex, theme } from "antd";

import VideoChat from "../videoChat";

import Header from "./components/Header";
import MessageComposer from "./components/MessageComposer";
import MessageHistory from "./components/MessageHistory";

const { useToken } = theme;

function Conversation() {
  const { token } = useToken();
  const params = useParams();

  const { client: socketIOClient } = useSocketIoClientContextValue();
  const socketIOActions = useSocketIOConfigActions();

  useEffect(() => {
    const chatId = params?.chatId;
    console.log("Mounting conversation component, chat id : ", chatId);
    console.log(params?.chatId, socketIOClient);
    if (!socketIOClient) {
      console.log(
        "Empty socketIOClient, this means the user is joining a chat!!"
      );
      socketIOActions.joinRoom(chatId!);
    }

    return () => {};
  }, [params?.chatId, socketIOActions, socketIOClient]);

  return (
    <Flex
      style={{
        backgroundColor: token.colorPrimaryBg,
        width: "100dvw",
        height: "100dvh",
      }}
    >
      <VideoChat />
      <Flex vertical align="center" flex={1}>
        <Header />
        <MessageHistory />
        <MessageComposer />
      </Flex>
    </Flex>
  );
}

export default Conversation;
