import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Flex, Space, theme, Typography } from "antd";
import { useSocketIoClientContextValue } from "../../../../common/hooks/useSocketIOContextValue";
import { useSocketIOConfigActions } from "../../../../common/hooks/useSocketIOConfigActions";
import { AudioOutlined, VideoCameraOutlined } from "@ant-design/icons";

const { useToken } = theme;
const { Text, Paragraph } = Typography;

function Conversation() {
  const { token } = useToken();
  const { client: socketIOClient } = useSocketIoClientContextValue();
  const socketIOActions = useSocketIOConfigActions();
  const params = useParams();
  useEffect(() => {
    console.log("Mounting conversation component, chat id", params?.chatId);
    console.log(params?.chatId, socketIOClient);
    if (!socketIOClient) {
      console.log(
        "Empty socketIOClient, this means the user is joining a chat!!"
      );
      socketIOActions.joinRoom();
    }

    return () => {};
  }, [params?.chatId, socketIOActions, socketIOClient]);

  const myId = 1;
  const messages = [
    {
      sender: "Giovanni Aguirre",
      senderId: 1,
      message: "Hello there",
      timestamp: "2024-08-17T22:54:23.831Z",
    },
    {
      sender: "Aurelio Bottas",
      senderId: 2,
      message: "General Kenobi!",
      timestamp: "2024-08-17T22:55:12.432Z",
    },
    {
      sender: "Giovanni Aguirre",
      senderId: 1,
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      timestamp: "2024-08-17T22:54:23.831Z",
    },
    {
      sender: "Aurelio Bottas",
      senderId: 2,
      message:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
      timestamp: "2024-08-17T22:55:12.432Z",
    },
  ];

  return (
    <Flex
      vertical
      align="center"
      style={{
        backgroundColor: token.colorPrimaryBg,
        width: "100dvw",
        height: "100dvh",
      }}
    >
      <Flex
        data-test-id="header"
        justify="center"
        style={{
          width: "100%",
          borderBottomWidth: "0.125rem",
          borderBottomStyle: "solid",
          borderColor: token.colorBorder,
          height: "3.5rem",
        }}
      >
        <Flex
          vertical={false}
          justify="space-between"
          align="center"
          style={{
            width: "100%",
            maxWidth: "1920px",
          }}
        >
          <Text>This is a chat</Text>
          <Space>
            <Button
              shape="circle"
              size="large"
              icon={<VideoCameraOutlined />}
            />
            <Button shape="circle" size="large" icon={<AudioOutlined />} />
          </Space>
        </Flex>
      </Flex>
      <Flex
        vertical
        justify="space-between"
        align="center"
        style={{
          width: "100%",
          maxWidth: "1920px",
        }}
        data-test-id="conversation_area_container"
      >
        {messages.map((m) => {
          const isSender = m.senderId === myId;
          return (
            <Flex
              style={{
                padding: "1rem",
                margin: "1rem 1.2rem",
                maxWidth: "45%",
                borderRadius: isSender
                  ? "2rem 2rem 0.3rem 2rem"
                  : "2rem 2rem 2rem 0.3rem",
                backgroundColor: token.colorBgContainerDisabled,
                alignSelf: isSender ? "end" : "start",
              }}
            >
              <Paragraph style={{ margin: 0 }}>{m.message}</Paragraph>
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
}

export default Conversation;
