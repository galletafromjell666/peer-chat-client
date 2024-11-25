import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRTCAndSocketIOEvents } from "@common/hooks/useRTCAndSocketIOEvents";
import { useSocketIOConfigActions } from "@common/hooks/useSocketIOConfigActions";
import { useSocketIoClientContextValue } from "@common/hooks/useSocketIOContextValue";
import { Flex, theme } from "antd";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

import VideoChat from "../videoChat";

import Header from "./components/Header";
import MessageComposer from "./components/MessageComposer";
import MessageHistory from "./components/MessageHistory";

const { useToken } = theme;

function Conversation() {
  useRTCAndSocketIOEvents();
  const { token } = useToken();
  const params = useParams();
  const screens = useBreakpoint();

  const { client: socketIOClient } = useSocketIoClientContextValue();
  const socketIOActions = useSocketIOConfigActions();

  useEffect(() => {
    const chatId = params?.chatId;
    if (!socketIOClient) {
      console.log(
        "Empty socketIOClient, this means the user is joining a chat!!"
      );
      socketIOActions.joinRoom(chatId!);
    }

    return () => {};
  }, [params?.chatId, socketIOActions, socketIOClient]);

  const isExtraSmallScreen = screens.xs;

  return (
    <Flex
      style={{
        backgroundColor: token.colorPrimaryBg,
        width: "100dvw",
        height: "100dvh",
        flexDirection: screens.xs ? "column" : "row",
        overflow: "hidden",
      }}
    >
      <VideoChat />
      <Flex
        vertical
        align="center"
        style={{ flex: 1, width: isExtraSmallScreen ? "100%" : "45%" }}
      >
        <Header />
        <MessageHistory />
        <MessageComposer />
      </Flex>
    </Flex>
  );
}

export default Conversation;
