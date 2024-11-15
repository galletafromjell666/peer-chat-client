import { useMemo } from "react";
import {
  useIncomingMediaStream,
  useOutgoingMediaStream,
} from "@common/hooks/useMediaStreamStore";
import { Flex, theme } from "antd";
const { useToken } = theme;

import Controls from "./components/controls";
import VideoPlayer from "./components/videoPlayer";

const defaultLabels = {
  outgoing: "You",
  incoming: "Your peer",
};

function VideoChat() {
  const { token } = useToken();
  const incomingMediaStream = useIncomingMediaStream();
  const outgoingMediaStream = useOutgoingMediaStream();

  const RenderComponent = useMemo(() => {
    if (incomingMediaStream && !outgoingMediaStream) {
      // Only incoming video!
      return (
        <VideoPlayer
          label={defaultLabels.incoming}
          isBigFrame
          stream={incomingMediaStream}
        />
      );
    }

    if (outgoingMediaStream && !incomingMediaStream) {
      // Only outgoing video!
      return (
        <VideoPlayer
          label={defaultLabels.outgoing}
          isBigFrame
          stream={outgoingMediaStream}
        />
      );
    }

    if (incomingMediaStream && outgoingMediaStream) {
      // Both videos!, applying the big frame to the incoming
      return (
        <>
          <VideoPlayer
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

    return null;
  }, [incomingMediaStream, outgoingMediaStream]);

  if (!RenderComponent) return null;

  return (
    <Flex
      style={{
        alignItems: "center",
        width: "60%",
        height: "100%",
        padding: "0.75rem",
        borderColor: token.colorBorder,
        borderRightStyle: "solid",
      }}
    >
      <Flex
      style={{
        position: "relative"
      }}>{RenderComponent}</Flex>
      <Controls />
    </Flex>
  );
}

export default VideoChat;
