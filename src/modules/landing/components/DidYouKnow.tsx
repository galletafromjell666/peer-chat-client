import React from "react";
import { Flex, Typography } from "antd";

import SectionContainer from "./SectionContainer";
const { Title } = Typography;
function DidYouKnow() {
  return (
    <SectionContainer>
      <Flex
        style={{
          flex: 1,
          justifyContent: "space-evenly",
          alignItems: "center",
          gap: "0.75rem",
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
    </SectionContainer>
  );
}

export default DidYouKnow;
