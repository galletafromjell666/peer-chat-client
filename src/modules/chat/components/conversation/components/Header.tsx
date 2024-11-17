import { VideoCameraOutlined } from "@ant-design/icons";
import useMediaStreamActions from "@common/hooks/useMediaStreamActions";
import { useOutgoingMediaStream } from "@common/hooks/useMediaStreamStore";
import { mediaDevicesErrorAccessMessage } from "@common/utils/constants";
import { Button, Flex, notification, Space, theme, Typography } from "antd";
import { isNil } from "lodash";

const { useToken } = theme;
const { Text } = Typography;
const { useNotification } = notification;

function Header() {
  const [msg, contextHolder] = useNotification();
  const outgoingMediaStream = useOutgoingMediaStream();
  const hasOutgoingStream = !isNil(outgoingMediaStream);
  const { addMediaStreamToRTCConnection, removeMediaStreamToRTCConnection } =
    useMediaStreamActions();

  const handleOutgoingStream = async () => {
    if (hasOutgoingStream) {
      removeMediaStreamToRTCConnection();
      return;
    }

    const response = await addMediaStreamToRTCConnection();
    if (response?.status === "error") {
      msg.error(mediaDevicesErrorAccessMessage);
    }
  };
  const { token } = useToken();
  return (
    <>
      {contextHolder}
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
            padding: "0.5rem",
            width: "100%",
            maxWidth: "1450px",
          }}
        >
          <Text>This is a chat</Text>
          <Space>
            <Button
              onClick={handleOutgoingStream}
              shape="circle"
              icon={<VideoCameraOutlined />}
            />
          </Space>
        </Flex>
      </Flex>
    </>
  );
}

export default Header;
