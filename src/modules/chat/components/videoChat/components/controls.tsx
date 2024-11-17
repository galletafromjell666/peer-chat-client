import { useState } from "react";
import useMediaStreamActions from "@common/hooks/useMediaStreamActions";
import { useOutgoingMediaStream } from "@common/hooks/useMediaStreamStore";
import { mediaDevicesErrorAccessMessage } from "@common/utils/constants";
import { Button, Flex,  notification } from "antd";
import { isNil } from "lodash";

import ConfigurationModal from "./configurationModal";

function Controls() {
  const [isMuted, setIsMuted] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const {
    addMediaStreamToRTCConnection,
    removeMediaStreamToRTCConnection,
    updateMediaStreamTrackEnableValue,
  } = useMediaStreamActions();
  const outgoingMediaStream = useOutgoingMediaStream();
  const hasOutgoingStream = !isNil(outgoingMediaStream);
  const [msg, contextHolder] = notification.useNotification();

  const handleOutgoingStream = async () => {
    if (hasOutgoingStream) {
      removeMediaStreamToRTCConnection();
      return;
    }

    const response = await addMediaStreamToRTCConnection();
    if (response?.status === "error") {
      msg.error(mediaDevicesErrorAccessMessage);
    }
  };

  const handleMuteAndUnmuteAudio = () => {
    if (isMuted) {
      updateMediaStreamTrackEnableValue("audio", true);
      setIsMuted(false);
      return;
    }
    updateMediaStreamTrackEnableValue("audio", false);
    setIsMuted(true);
  };

  return (
    <>
      {contextHolder}
      <Flex vertical={false} gap="8">
        <Button onClick={handleOutgoingStream}>
          {hasOutgoingStream ? "stop" : "start"}
        </Button>
        <Button onClick={handleMuteAndUnmuteAudio}>
          {isMuted ? "unmute" : "mute"}
        </Button>
        <Button onClick={() => setIsConfigModalOpen((t) => !t)}>Config</Button>
      </Flex>
      <ConfigurationModal
        isOpen={isConfigModalOpen}
        closeModal={() => {
          setIsConfigModalOpen(false);
        }}
      />
    </>
  );
}

export default Controls;
