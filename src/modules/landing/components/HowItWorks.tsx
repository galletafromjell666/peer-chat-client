import { useState } from "react";
import { Steps } from "antd";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

import SectionContainer from "./SectionContainer";

function HowItWorks() {
  const [current, setCurrent] = useState(0);
  const screens = useBreakpoint();
  const onChange = (value: number) => {
    setCurrent(value);
  };

  return (
    <SectionContainer title="How it works?" isBordered id="cards">
      <Steps
        direction={!screens.md ? "vertical" : "horizontal"}
        current={current}
        onChange={onChange}
        items={[
          {
            title: "Generate a Room",
            description: "Click 'Start Chat' to create a private chat room.",
          },
          {
            title: "Share the Link",
            description: "Invite your chat partner by sharing the unique link.",
          },
          {
            title: "Enjoy Secure Communication",
            description:
              "Talk, share files, and video chat with no interruptions.",
          },
        ]}
      />
    </SectionContainer>
  );
}

export default HowItWorks;
