import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Divider,
  Flex,
  Layout,
  Space,
  Steps,
  theme,
  Typography,
} from "antd";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

const { useToken } = theme;
const { Header, Content, Footer } = Layout;
const { Text, Title, Paragraph } = Typography;

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useToken();
  const screens = useBreakpoint();

  const [current, setCurrent] = useState(0);

  const onChange = (value: number) => {
    setCurrent(value);
  };

  const handleStartChattingButton = () => {
    navigate("/chat/create-join");
  };
  return (
    <Layout style={{}}>
      <Header
        style={{
          backgroundColor: token.colorBgBase,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: "0.125rem",
          borderBottomStyle: "solid",
          borderColor: token.colorBorder,
        }}
      >
        <Title level={3} italic style={{ margin: 0 }}>
          PeerChat
        </Title>
        <Space>
          <Button type="primary" onClick={handleStartChattingButton}>
            Start Chatting
          </Button>
          <Button>View on GitHub</Button>
        </Space>
      </Header>
      <Content style={{ padding: "0 48px" }}>
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
              alignSelf: screens.md ? "flex-end" : "unset",
            }}
          >
            <Title level={4}>
              Your privacy matters. No stateful servers, no snooping, just you
              and your chat partner.
            </Title>
            <Flex vertical={!screens.md} style={{ gap: "1rem" }}>
              <Button type="primary" onClick={handleStartChattingButton}>
                Start Chatting Now
              </Button>
              <Button>Learn More About PeerChat</Button>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          vertical
          id="why"
          style={{
            padding: "1rem",
            borderRadius: "1rem",
            margin: "2rem 1rem",
            borderWidth: "0.125rem",
            borderStyle: "solid",
            borderColor: token.colorBorder,
          }}
        >
          <Title style={{ margin: "0 0 1.5rem 0" }} level={3}>
            Why PeerChat?
          </Title>
          <Flex
            vertical={!screens.md}
            style={{
              justifyContent: "center",
              alignItems: !screens.md ? "center" : "unset",
            }}
            gap="2rem"
          >
            <Card title="Complete Privacy" bordered style={{ width: 250 }}>
              <Text>
                With PeerChat, your messages never touch a server. Your data
                stays between you and your chat partner.
              </Text>
            </Card>
            <Card title="End-to-End Encryption" bordered style={{ width: 250 }}>
              <Text>
                Every conversation is fully encrypted, ensuring only you and
                your partner can read or access your messages.
              </Text>
            </Card>
            <Card title="No Central Storage" bordered style={{ width: 250 }}>
              <Text>
                Unlike traditional chat apps, PeerChat doesn’t store your
                messages, files, or metadata anywhere.
              </Text>
            </Card>
            <Card title="Easy to Use" bordered style={{ width: 250 }}>
              <Text>
                All you need is a browser and a link. No sign-ups, no
                installations, just secure communication.
              </Text>
            </Card>
          </Flex>
        </Flex>
        <Flex
          style={{
            padding: "1rem",
            borderRadius: "1rem",
            margin: "2rem 1rem",
            borderWidth: "0.125rem",
            borderStyle: "solid",
            borderColor: token.colorBorder,
          }}
        >
          <Flex vertical flex={1}>
            <Title style={{ margin: "0 0 1.5rem 0" }} level={3}>
              How it works?
            </Title>
            <Flex>
              <Steps
                direction={!screens.md ? "vertical" : "horizontal"}
                current={current}
                onChange={onChange}
                items={[
                  {
                    title: "Generate a Room",
                    description:
                      "Click 'Start Chat' to create a private chat room.",
                  },
                  {
                    title: "Share the Link",
                    description:
                      "Invite your chat partner by sharing the unique link.",
                  },
                  {
                    title: "Enjoy Secure Communication",
                    description:
                      "Talk, share files, and video chat with no interruptions.",
                  },
                ]}
              />
            </Flex>
          </Flex>
        </Flex>
        <Flex
          vertical
          id="why"
          style={{
            padding: "1rem",
            borderRadius: "1rem",
            margin: "2rem 1rem",
            borderWidth: "0.125rem",
            borderStyle: "solid",
            borderColor: token.colorBorder,
          }}
        >
          <Title style={{ margin: "0 0 1.5rem 0" }} level={3}>
            Your Privacy is a Priority.
          </Title>
          <ul>
            <li>
              <Text>
                PeerChat uses WebRTC technology to establish direct, secure
                connections between you and your partner.
              </Text>
            </li>
            <li>
              <Text>
                With no data stored on servers, there’s nothing to hack or
                track.
              </Text>
            </li>
          </ul>
        </Flex>
        <Flex
          style={{
            padding: "1rem",
            margin: "2rem 1rem",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Title style={{ margin: "0 0 1.5rem 0" }} level={3}>
            Did you know?
          </Title>
          <Flex vertical style={{ gap: "1rem" }}>
            <Title level={4}>
              With PeerChat, even we can’t access your messages
            </Title>
            <Title level={5} style={{ margin: "0.25rem 0" }}>
              because we don’t have them!
            </Title>
          </Flex>
        </Flex>
        <Flex
          vertical
          id="why"
          style={{
            padding: "1rem",
            borderRadius: "1rem",
            margin: "2rem 1rem",
            borderWidth: "0.125rem",
            borderStyle: "solid",
            borderColor: token.colorBorder,
          }}
        >
          <Title style={{ margin: "0 0 1.5rem 0" }} level={3}>
            Technical Insights
          </Title>
          <Flex
            vertical
            style={{
              justifyContent: "center",
              alignItems: !screens.md ? "center" : "unset",
            }}
          >
            <div>
              <Title style={{ margin: 0 }} level={5}>
                Direct Connections, No Middlemen
              </Title>
              <Paragraph style={{ margin: "0.5rem 0" }}>
                PeerChat uses WebRTC (Web Real-Time Communication) to establish
                direct, secure connections between users. This means your
                messages and calls don’t pass through central servers, keeping
                your data truly private. WebRTC’s end-to-end encryption ensures
                that only you and the person you’re communicating with can see
                or hear what’s being shared.
              </Paragraph>
            </div>
            <Divider />
            <div>
              <Title style={{ margin: 0 }} level={5}>
                How Connections Are Made
              </Title>
              <Paragraph style={{ margin: "0.5rem 0" }}>
                Before two peers can start chatting, they need to exchange
                connection details securely. PeerChat uses a lightweight
                signaling server powered by Socket.IO for this purpose.
              </Paragraph>
              <ul>
                <li>
                  <>
                    <Paragraph strong style={{ margin: 0 }}>
                      What’s Signaling?
                    </Paragraph>
                    <Paragraph style={{ margin: 0 }}>
                      It’s the process of exchanging metadata (like IP
                      addresses) needed for WebRTC to set up a connection.
                    </Paragraph>
                  </>
                </li>
                <li>
                  <>
                    <Paragraph strong style={{ margin: 0 }}>
                      How It Works:
                    </Paragraph>
                    <Paragraph style={{ margin: 0 }}>
                      The signaling server only handles the initial handshake to
                      facilitate the peer-to-peer connection. Once connected,
                      all communication happens directly between users.
                    </Paragraph>
                  </>
                </li>
              </ul>
            </div>
            <Divider />
            <div>
              <Title style={{ margin: 0 }} level={5}>
                Built for Scalability and Simplicity
              </Title>
              <Paragraph style={{ margin: "0.5rem 0" }}>
                PeerChat’s architecture ensures fast, secure, and efficient
                communication:
              </Paragraph>
              <ul>
                <li>
                  <>
                    <Paragraph strong style={{ margin: 0 }}>
                      Socket.IO
                    </Paragraph>
                    <Paragraph style={{ margin: 0 }}>
                      Handles real-time signaling for both WebRTC offers and
                      answers.
                    </Paragraph>
                  </>
                </li>
                <li>
                  <>
                    <Paragraph strong style={{ margin: 0 }}>
                      Decentralized Communication
                    </Paragraph>
                    <Paragraph style={{ margin: 0 }}>
                      Ensures messages and files don’t linger on third-party
                      servers.
                    </Paragraph>
                  </>
                </li>
                <li>
                  <>
                    <Paragraph strong style={{ margin: 0 }}>
                      Cross-Device Compatibility
                    </Paragraph>
                    <Paragraph style={{ margin: 0 }}>
                      Allows you to connect from any browser or device without
                      additional plugins or software.
                    </Paragraph>
                  </>
                </li>
              </ul>
            </div>
          </Flex>
        </Flex>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        <Text style={{ fontSize: "1.115rem" }}>Developed with ❤️ in 🇸🇻</Text>
      </Footer>
    </Layout>
  );
};

export default Landing;
