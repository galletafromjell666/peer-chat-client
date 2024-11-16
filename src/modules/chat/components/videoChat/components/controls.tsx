import useMediaStreamActions from "@common/hooks/useMediaStreamActions";
import { useOutgoingMediaStream } from "@common/hooks/useMediaStreamStore";
import { Button, Flex } from "antd";
import { isNil } from "lodash";

function Controls() {
  const { addMediaTracksToRTCConnection, removeMediaTracksToRTCConnection } =
    useMediaStreamActions();
  const outgoingMediaStream = useOutgoingMediaStream();
  const hasOutgoingStream = !isNil(outgoingMediaStream);

  const handleOutgoingStream = () => {
    if (hasOutgoingStream) {
      removeMediaTracksToRTCConnection();
      return;
    }
    addMediaTracksToRTCConnection();
  };

  return (
    <Flex vertical={false} gap="8">
      <Button onClick={handleOutgoingStream}>
        {hasOutgoingStream ? "stop" : "start"}
      </Button>
      <Button>Mute/ Unmute</Button>
      <Button>Config</Button>
    </Flex>
  );
}

export default Controls;
