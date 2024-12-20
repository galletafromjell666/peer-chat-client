import { useNavigate } from "react-router-dom";
import { CaretRightOutlined, GithubOutlined } from "@ant-design/icons";
import { Button, Layout, Space, theme, Typography } from "antd";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

const { Header } = Layout;
const { Title } = Typography;
const { useToken } = theme;

function LandingPageHeader() {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const { token } = useToken();

  const handleStartChattingButton = () => {
    navigate("/chat/create-join");
  };

  const handleOpeGitHubButton = () => {
    window.open(
      "https://github.com/galletafromjell666/peer-chat-client",
      "_blank"
    );
  };

  const isMediumScreen = screens.md;

  return (
    <Header
      style={{
        backgroundColor: token.colorBgContainerDisabled,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: "0.125rem",
        borderBottomStyle: "solid",
        borderColor: token.colorBorder,
        padding: "0 1rem",
      }}
    >
      <Title level={3} italic style={{ margin: 0 }}>
        PeerChat
      </Title>
      <Space>
        <Button
          icon={<CaretRightOutlined />}
          type="primary"
          onClick={handleStartChattingButton}
        >
          {isMediumScreen ? "Start Chatting" : null}
        </Button>
        <Button onClick={handleOpeGitHubButton} icon={<GithubOutlined />}>
          {isMediumScreen ? "View on GitHub" : null}
        </Button>
      </Space>
    </Header>
  );
}

export default LandingPageHeader;
