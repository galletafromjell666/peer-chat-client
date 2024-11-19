import {
  useIncomingMediaStream,
  useOutgoingMediaStream,
} from "@common/hooks/useMediaStreamStore";
import { Flex, theme } from "antd";
const { useToken } = theme;

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

  console.log({ incomingMediaStream, outgoingMediaStream });

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

  return (
    <Flex
      style={{
        alignItems: "center",
        width: "60%",
        flexDirection: "column",
        justifyContent: "center",
        gap: "1rem",
        height: "100%",
        padding: "0.75rem",
        borderColor: token.colorBorder,
        borderRightStyle: "solid",
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
  );
}

export default VideoChat;
