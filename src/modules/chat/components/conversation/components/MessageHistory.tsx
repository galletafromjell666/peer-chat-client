import { useMessages } from "@common/store";
import { downloadFileFromUrl } from "@common/utils/files";
import { PeerChatFileData } from "@peer-chat-types/index";
import { Button, Flex, Space, theme, Tooltip, Typography } from "antd";
import { format, fromUnixTime } from "date-fns";
import { isEmpty } from "lodash";

const { Paragraph, Text } = Typography;
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
        overflowX: "hidden",
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
          const isFile = !isEmpty(m.fileData);
          const isOutboundMessage = !m.isReceived;
          const date = fromUnixTime(m.timestamp / 1000);
          const formattedShortDate = format(date, "HH:mm");
          const formattedLongDate = format(date, "yyyy-MM-dd HH:mm:ss");

          return (
            <Flex
              key={m.id}
              vertical
              style={{
                width: "100%",
                margin: "0.5rem",
                alignSelf: isOutboundMessage ? "end" : "start",
              }}
            >
              <Flex
                style={{
                  padding: "1rem",
                  maxWidth: "45%",
                  borderRadius: isOutboundMessage
                    ? "2rem 2rem 0.3rem 2rem"
                    : "2rem 2rem 2rem 0.3rem",
                  backgroundColor: token.colorBgContainerDisabled,
                  alignSelf: isOutboundMessage ? "end" : "start",
                }}
              >
                {!isFile ? (
                  <Paragraph style={{ margin: 0 }}>{m.message}</Paragraph>
                ) : (
                  <Flex
                    vertical
                    style={{
                      alignItems: "center",
                      rowGap: "0.5rem",
                    }}
                  >
                    <Text type="secondary" style={{ margin: 0 }}>
                      {m.fileData?.name}
                    </Text>
                    <div>
                      <Button
                        onClick={() => {
                          const fileData = m.fileData as PeerChatFileData;
                          downloadFileFromUrl(fileData.url!, fileData.name);
                        }}
                        loading={m.fileData?.status !== "complete"}
                        iconPosition="end"
                      >
                        {isOutboundMessage && m.fileData?.status !== "complete"
                          ? "Uploading"
                          : "Download"}
                      </Button>
                    </div>
                  </Flex>
                )}
              </Flex>
              <Space
                style={{
                  alignSelf: isOutboundMessage ? "end" : "start",
                }}
              >
                <Tooltip title={<span>{formattedLongDate}</span>}>
                  <Text
                    style={{ margin: 0, fontSize: "0.85rem" }}
                    type="secondary"
                  >
                    {formattedShortDate}
                  </Text>
                </Tooltip>
              </Space>
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
}

export default MessageHistory;
