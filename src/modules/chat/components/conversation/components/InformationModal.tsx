import { useAreNotificationsEnabled, useStoreActions } from "@common/store";
import { requestNotificationPermission } from "@common/utils/messaging";
import { Flex, Modal, Switch, Typography } from "antd";

interface InformationModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

const { Text, Title } = Typography;

function InformationModal({ isOpen, handleClose }: InformationModalProps) {
  const { toggleNotifications } = useStoreActions();
  const areNotificationsEnabled = useAreNotificationsEnabled();

  const handleNotificationsSwitchClick = () => {
    requestNotificationPermission(toggleNotifications);
  };

  const fullUrl = window.location.href;

  return (
    <>
      <Modal
        open={isOpen}
        destroyOnClose
        onClose={handleClose}
        onCancel={handleClose}
        title="Chat Information"
        footer={null}
      >
        <Flex vertical style={{ gap: "0.5rem" }}>
          <Text>
            You can join this chat using the link below from your browser.
            Please note that this is a peer-to-peer connection, so only two
            users can join the chat simultaneously.
          </Text>
          <Text copyable keyboard>
            {fullUrl}
          </Text>
          <Title
            level={5}
            style={{
              margin: "0.5rem",
            }}
          >
            Privacy & Security
          </Title>
          <ul>
            <li>
              <Text>
                Encrypted Connection: Your messages, audio and video streams are
                encrypted to ensure privacy.
              </Text>
            </li>
            <li>
              <Text>
                No data is stored on a server, ensuring secure communication.
              </Text>
            </li>
          </ul>
          <Title level={5} style={{ margin: "0.5rem 0 0.5rem 0.5rem" }}>
            Supported Devices
          </Title>
          <ul>
            <li>
              <Text>Modern browsers like Google Chrome, Firefox, or Edge.</Text>
            </li>
            <li>
              <Text>
                Works on both desktop and mobile devices (with access to camera
                and microphone).
              </Text>
            </li>
          </ul>
          <Title
            level={5}
            style={{
              margin: "0.5rem",
            }}
          >
            Notifications
          </Title>
          <Flex style={{ margin: "0 0.5rem", justifyContent: "space-between" }}>
            <Text>Enable notifications for incoming messages</Text>
            <Switch
              checked={areNotificationsEnabled}
              onClick={handleNotificationsSwitchClick}
            />
          </Flex>
        </Flex>
      </Modal>
    </>
  );
}

export default InformationModal;
