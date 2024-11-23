import { Divider, Flex,Typography } from "antd";

import SectionContainer from "./SectionContainer";

const { Title, Paragraph } = Typography;

function TechnicalInsights() {
  return (
    <SectionContainer
      title="Technical Insights"
      isBordered
      id="technical-insights"
    >
      <Flex
        vertical
        style={{
          justifyContent: "center",
          
        }}
      >
        <div>
          <Title style={{ margin: 0 }} level={5}>
            Direct Connections, No Middlemen
          </Title>
          <Paragraph style={{ margin: "0.5rem 0" }}>
            PeerChat uses WebRTC (Web Real-Time Communication) to establish
            direct, secure connections between users. This means your messages
            and calls don’t pass through central servers, keeping your data
            truly private. WebRTC’s end-to-end encryption ensures that only you
            and the person you’re communicating with can see or hear what’s
            being shared.
          </Paragraph>
        </div>
        <Divider />
        <div>
          <Title style={{ margin: 0 }} level={5}>
            How Connections Are Made
          </Title>
          <Paragraph style={{ margin: "0.5rem 0" }}>
            Before two peers can start chatting, they need to exchange
            connection details securely. PeerChat uses a lightweight signaling
            server powered by Socket.IO for this purpose.
          </Paragraph>
          <ul>
            <li>
              <>
                <Paragraph strong style={{ margin: 0 }}>
                  What’s Signaling?
                </Paragraph>
                <Paragraph style={{ margin: 0 }}>
                  It’s the process of exchanging metadata (like IP addresses)
                  needed for WebRTC to set up a connection.
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
                  facilitate the peer-to-peer connection. Once connected, all
                  communication happens directly between users.
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
    </SectionContainer>
  );
}

export default TechnicalInsights;
