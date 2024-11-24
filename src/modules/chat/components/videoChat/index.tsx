import {
  useIncomingMediaStream,
  useOutgoingMediaStream,
} from "@common/hooks/useMediaStreamStore";
import { Flex, theme } from "antd";
const { useToken } = theme;

import SmallScreenNotice from "@common/components/SmallScreenNotice";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

import Controls from "./components/MediaControls";
import VideoPlayer from "./components/VideoPlayer";

const defaultLabels = {
  outgoing: "You",
  incoming: "Your peer",
};

function VideoChat() {
  const { token } = useToken();
  const incomingMediaStream = useIncomingMediaStream();
  const outgoingMediaStream = useOutgoingMediaStream();

  const screens = useBreakpoint();

  let RenderComponent = null;
  if (
    incomingMediaStream &&
    incomingMediaStream.active &&
    !outgoingMediaStream
  ) {
    // Only incoming video!
    RenderComponent = (
      <VideoPlayer
        label={defaultLabels.incoming}
        isBigFrame
        stream={incomingMediaStream}
      />
    );
  }

  if (
    outgoingMediaStream &&
    outgoingMediaStream.active &&
    !incomingMediaStream
  ) {
    // Only outgoing video!
    RenderComponent = (
      <VideoPlayer
        muted
        label={defaultLabels.outgoing}
        isBigFrame
        stream={outgoingMediaStream}
      />
    );
  }

  if (
    incomingMediaStream &&
    incomingMediaStream.active &&
    outgoingMediaStream &&
    outgoingMediaStream.active
  ) {
    // Both videos!, applying the big frame to the incoming
    RenderComponent = (
      <>
        <VideoPlayer
          muted
          label={defaultLabels.outgoing}
          isBigFrame={false}
          stream={outgoingMediaStream}
        />
        <VideoPlayer
          label={defaultLabels.incoming}
          isBigFrame
          stream={incomingMediaStream}
        />
      </>
    );
  }

  if (!RenderComponent) return null;

  const isExtraSmallScreen = screens.xs;

  return (
    <>
      <SmallScreenNotice />
      <Flex
        style={{
          alignItems: "center",
          width: !isExtraSmallScreen ? "55%" : "unset",
          flexDirection: "column",
          justifyContent: "center",
          gap: !isExtraSmallScreen ? "1rem" : "0.5rem",
          height: !isExtraSmallScreen ? "100%" : "50%",
          padding: "0.75rem",
          borderColor: token.colorBorder,
          borderRightStyle: !isExtraSmallScreen ? "solid" : "none",
        }}
      >
        <Flex
          vertical
          style={{
            gap: "1rem",
            maxWidth: "1250px",
            position: "relative",
          }}
        >
          {RenderComponent}
        </Flex>
        <Controls />
      </Flex>
    </>
  );
}

export default VideoChat;
