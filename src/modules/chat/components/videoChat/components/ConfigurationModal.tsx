import { useEffect, useState } from "react";
import useMediaStreamActions from "@common/hooks/useMediaStreamActions";
import {
  usePreferredAudioInput,
  usePreferredAudioOutput,
  usePreferredVideoInput,
} from "@common/store";
import { Flex, Modal, Select, Typography } from "antd";
import { isEmpty } from "lodash";

const { Text } = Typography;

interface ConfigurationModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

interface MediaDevicesMap {
  audioinput: MediaDeviceInfo[];
  videoinput: MediaDeviceInfo[];
  audiooutput: MediaDeviceInfo[];
}

const initialMediaDevicesMap: MediaDevicesMap = {
  audioinput: [],
  videoinput: [],
  audiooutput: [],
};

function ConfigurationModal({ isOpen, closeModal }: ConfigurationModalProps) {
  const { replaceTrackFromMediaStream } = useMediaStreamActions();
  const [inputChanges, setInputChanges] = useState<
    { kind: "audio" | "video"; id: string }[]
  >([]);
  const [devices, setDevices] = useState<MediaDevicesMap>(
    initialMediaDevicesMap
  );

  // TODO: refactor to react-hook-form!!

  const preferredAudioOutput = usePreferredAudioOutput();
  const preferredAudioInput = usePreferredAudioInput();
  const preferredVideoInput = usePreferredVideoInput();

  useEffect(() => {
    const getMediaDevices = async () => {
      const navigatorDevices = await navigator.mediaDevices.enumerateDevices();
      const grouped = navigatorDevices.reduce<MediaDevicesMap>(
        (acc, device) => {
          // Prevent duplicates
          if (acc[device.kind].some((d) => d.deviceId === device.deviceId)) {
            return acc;
          }

          acc[device.kind].push(device);
          return acc;
        },
        initialMediaDevicesMap
      );
      setDevices(grouped);
    };

    getMediaDevices();
    return () => {};
  }, []);

  const handleOk = async () => {
    console.log("Applying input changes: ", inputChanges);
    inputChanges.forEach(async ({ kind, id }) => {
      await replaceTrackFromMediaStream(kind, id);
    });
  };

  const handleCancel = () => {
    closeModal();
  };

  const handleAudioInputDeviceChange = (value: string) => {
    setInputChanges((c) => {
      // Filter out all changes not related to "audio"
      const filteredChanges = c.filter((ch) => ch.kind !== "audio");

      // Add the new "audio" change
      return [...filteredChanges, { kind: "audio", id: value }];
    });
  };

  const handleAudioOutputDeviceChange = (value: string) => {
    console.log(value);
  };

  const handleVideoInputDeviceChange = (value: string) => {
    setInputChanges((c) => {
      // Filter out all changes not related to "audio"
      const filteredChanges = c.filter((ch) => ch.kind !== "video");

      // Add the new "audio" change
      return [...filteredChanges, { kind: "video", id: value }];
    });
  };

  console.log(devices);

  return (
    <Modal
      destroyOnClose
      title="Media Devices Configuration"
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Flex vertical style={{ gap: "0.5rem" }}>
        {!isEmpty(devices.audioinput) && (
          <Flex vertical>
            <Text type="secondary">Audio input device:</Text>
            <Select
              data-test-id="audio-input"
              defaultValue={
                preferredAudioInput || devices.audioinput[0].deviceId
              }
              style={{ width: "100%" }}
              onChange={handleAudioInputDeviceChange}
              options={devices.audioinput.map((device) => {
                return { value: device.deviceId, label: device.label };
              })}
            />
          </Flex>
        )}
        {!isEmpty(devices.audiooutput) && (
          <Flex vertical>
            <Text type="secondary">Audio output device:</Text>
            <Select
              data-test-id="audio-input"
              defaultValue={
                preferredAudioOutput || devices.audiooutput[0].deviceId
              }
              style={{ width: "100%" }}
              onChange={handleAudioOutputDeviceChange}
              options={devices.audiooutput.map((device) => {
                return { value: device.deviceId, label: device.label };
              })}
            />
          </Flex>
        )}
        {!isEmpty(devices.videoinput) && (
          <Flex vertical>
            <Text type="secondary">Video input device:</Text>
            <Select
              data-test-id="audio-input"
              defaultValue={
                preferredVideoInput || devices.videoinput[0].deviceId
              }
              style={{ width: "100%" }}
              onChange={handleVideoInputDeviceChange}
              options={devices.videoinput.map((device) => {
                return { value: device.deviceId, label: device.label };
              })}
            />
          </Flex>
        )}
      </Flex>
    </Modal>
  );
}

export default ConfigurationModal;
