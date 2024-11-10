import { AudioOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Button, Flex, Space, Typography, theme } from "antd";

const { useToken } = theme;
const { Text } = Typography;

function Header() {
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
          <Button shape="circle" icon={<VideoCameraOutlined />} />
          <Button shape="circle" icon={<AudioOutlined />} />
        </Space>
      </Flex>
    </Flex>
  );
}

export default Header;
