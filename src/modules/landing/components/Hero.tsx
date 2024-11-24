import { useNavigate } from "react-router-dom";
import { Button, Flex, Typography } from "antd";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

const { Title } = Typography;
function Hero() {
  const navigate = useNavigate();
  const screens = useBreakpoint();

  const handleStartChattingButton = () => {
    navigate("/chat/create-join");
  };

  const handleLearnMoreButton = () => {
    window.open(
      "https://github.com/galletafromjell666/peer-chat-client",
      "_blank"
    );
  };

  const isMediumScreen = screens.md;

  return (
    <Flex
      vertical
      id="hero"
      style={{
        padding: "1rem",
        margin: "3rem 1rem",
      }}
    >
      <Title style={{ maxWidth: "45rem", margin: "0" }}>
        Take Control of Your Conversations:
      </Title>
      <Title style={{ maxWidth: "45rem", margin: "0" }}>
        Peer-to-Peer, Secure,
      </Title>
      <Title level={3} style={{ maxWidth: "45rem", margin: "0" }}>
        and
      </Title>
      <Title style={{ maxWidth: "45rem", margin: "0", color: "green" }}>
        Free.
      </Title>
      <Flex
        vertical
        style={{
          maxWidth: "35rem",
          gap: "0.75rem",
          alignSelf: isMediumScreen ? "flex-end" : "unset",
        }}
      >
        <Title level={4}>
          Your privacy matters. No stateful servers, no snooping, just you and
          your chat partner.
        </Title>
        <Flex vertical={!isMediumScreen} style={{ gap: "1rem" }}>
          <Button type="primary" onClick={handleStartChattingButton}>
            Start Chatting Now
          </Button>
          <Button onClick={handleLearnMoreButton}>
            Learn More About PeerChat
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Hero;
