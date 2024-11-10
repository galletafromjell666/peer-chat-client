import { useState } from "react";
import { Flex, Button, Space, Input } from "antd";
import { FileAddOutlined } from "@ant-design/icons";
import { PeerChatDataChannelMessage } from "../../../../../types";
import { transformDataChannelMessageToPeerChatMessage } from "../../../../../common/utils/messaging";
import { useStoreActions } from "../../../../../common/store";
import { useRTCPeerConnectionContextValue } from "../../../../../common/hooks/useRTCConnectionContextValue";
import { useSocketIoClientContextValue } from "../../../../../common/hooks/useSocketIOContextValue";

function MessageComposer() {
  const [message, setMessage] = useState("");
  const { dataChannelRef } = useRTCPeerConnectionContextValue();
  const { client: socketIOClient } = useSocketIoClientContextValue();

  const { addMessage } = useStoreActions();

  const sendMessageToPeer = () => {
    const craftedMessage: PeerChatDataChannelMessage = {
      originatorId: socketIOClient?.socket.id ?? "",
      action: "message",
      payload: {
        id: crypto.randomUUID(),
        message,
      },
      timestamp: Date.now(),
    };

    // TODO: Update this to send a blob or a buffer array
    const serializedCraftedMessage = JSON.stringify(craftedMessage);
    dataChannelRef.current.send(serializedCraftedMessage);
    addMessage(
      transformDataChannelMessageToPeerChatMessage(
        craftedMessage,
        socketIOClient!
      )
    );
    setMessage("");
  };

  return (
    <Flex
      data-test-id="input-section"
      style={{
        width: "100%",
        maxWidth: "1450px",
      }}
    >
      <Flex
        style={{
          padding: "0.65rem 0.5rem",
          width: "100%",
          gap: "1rem",
        }}
      >
        <Button shape="circle" icon={<FileAddOutlined />} />
        <Space.Compact style={{ width: "100%" }}>
          <Input
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            value={message}
          />
          <Button type="primary" onClick={sendMessageToPeer}>
            Submit
          </Button>
        </Space.Compact>
      </Flex>
    </Flex>
  );
}

export default MessageComposer;
