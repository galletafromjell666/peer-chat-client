import { Flex, Typography, theme } from "antd";
import { useMessages } from "../../../../../common/store";

const { Paragraph } = Typography;
const { useToken } = theme;

function MessageHistory() {
  const { token } = useToken();
  const messages = useMessages();
  return (
    <Flex
      style={{
        height: "100%",
        width: "100%",
        overflowY: "auto",
      }}
      vertical
      justify="space-between"
    >
      <Flex
        vertical
        justify="space-between"
        align="center"
        style={{ maxWidth: "1450px" }}
        data-test-id="conversation_area_container"
      >
        {messages.map((m) => {
          //
          const isOutboundMessage = !m.isReceived;
          return (
            <Flex
              key={m.id}
              style={{
                padding: "1rem",
                margin: "0.5rem",
                maxWidth: "45%",
                borderRadius: isOutboundMessage
                  ? "2rem 2rem 0.3rem 2rem"
                  : "2rem 2rem 2rem 0.3rem",
                backgroundColor: token.colorBgContainerDisabled,
                alignSelf: isOutboundMessage ? "end" : "start",
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

export default MessageHistory;
