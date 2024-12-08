import { useState } from "react";
import {
  AudioMutedOutlined,
  AudioOutlined,
  ToolOutlined,
  VideoCameraAddOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import useMediaStreamActions from "@common/hooks/useMediaStreamActions";
import { useOutgoingMediaStream } from "@common/hooks/useMediaStreamStore";
import { mediaDevicesErrorAccessMessage } from "@common/utils/constants";
import { Button, Flex, notification, Tooltip } from "antd";
import isNil from "lodash/isNil";

import ConfigurationModal from "./ConfigurationModal";

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
      <Flex
        vertical={false}
        style={{
          gap: "1rem",
        }}
      >
        <Tooltip title={hasOutgoingStream ? "Stop Video" : "Start Video"}>
          <Button
            color={hasOutgoingStream ? "danger" : "default"}
            variant="outlined"
            onClick={handleOutgoingStream}
            icon={
              hasOutgoingStream ? (
                <VideoCameraOutlined />
              ) : (
                <VideoCameraAddOutlined />
              )
            }
            size="large"
          />
        </Tooltip>
        {hasOutgoingStream && (
          <>
            <Tooltip title={isMuted ? "Unmute Audio" : "Mute Audio"}>
              <Button
                size="large"
                variant="outlined"
                color={isMuted ? "danger" : "default"}
                icon={isMuted ? <AudioMutedOutlined /> : <AudioOutlined />}
                onClick={handleMuteAndUnmuteAudio}
              />
            </Tooltip>
            <Tooltip title="Open Media Configuration">
              <Button
                size="large"
                variant="outlined"
                color="default"
                icon={<ToolOutlined />}
                onClick={() => setIsConfigModalOpen((t) => !t)}
              />
            </Tooltip>
          </>
        )}
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
