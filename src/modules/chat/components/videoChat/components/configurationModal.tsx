import { useEffect, useState } from "react";
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
  const [devices, setDevices] = useState<MediaDevicesMap>(
    initialMediaDevicesMap
  );

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

  const handleOk = () => {};
  const handleCancel = () => {
    closeModal();
  };

  console.log(devices);

  return (
    <Modal
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
              onChange={() => {}}
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
              onChange={() => {}}
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
              onChange={() => {}}
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
