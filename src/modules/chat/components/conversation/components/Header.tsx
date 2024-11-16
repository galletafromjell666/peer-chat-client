import { VideoCameraOutlined } from "@ant-design/icons";
import useMediaStreamActions from "@common/hooks/useMediaStreamActions";
import { Button, Flex, Space, theme, Typography } from "antd";

const { useToken } = theme;
const { Text } = Typography;

function Header() {
  const { addMediaTracksToRTCConnection } = useMediaStreamActions();
  const { token } = useToken();
  return (
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
            onClick={addMediaTracksToRTCConnection}
            shape="circle"
            icon={<VideoCameraOutlined />}
          />
        </Space>
      </Flex>
    </Flex>
  );
}

export default Header;
