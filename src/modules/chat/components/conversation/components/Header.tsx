import { useState } from "react";
import { InfoCircleOutlined, VideoCameraOutlined } from "@ant-design/icons";
import useMediaStreamActions from "@common/hooks/useMediaStreamActions";
import { useOutgoingMediaStream } from "@common/hooks/useMediaStreamStore";
import { mediaDevicesErrorAccessMessage } from "@common/utils/constants";
import { Button, Flex, notification, Space, theme } from "antd";
import { isNil } from "lodash";

import InformationModal from "./InformationModal";

const { useToken } = theme;
const { useNotification } = notification;

function Header() {
  const [isInformationModalOpen, setIsInformationModalOpen] = useState(false);
  const [msg, contextHolder] = useNotification();
  const outgoingMediaStream = useOutgoingMediaStream();
  const hasOutgoingStream = !isNil(outgoingMediaStream);
  const { addMediaStreamToRTCConnection, removeMediaStreamToRTCConnection } =
    useMediaStreamActions();

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
  const { token } = useToken();
  return (
    <>
      {contextHolder}
      <Flex
        data-test-id="header"
        justify="center"
        style={{
          width: "100%",
          backgroundColor: token.colorBgContainerDisabled,
          borderBottomWidth: "0.125rem",
          borderBottomStyle: "solid",
          borderColor: token.colorBorder,
          height: "3.5rem",
        }}
      >
        <Flex
          vertical={false}
          justify="space-between"
          align="center"
          style={{
            padding: "0.5rem",
            width: "100%",
            maxWidth: "1450px",
          }}
        >
          <Space>
            <Button
              onClick={() => setIsInformationModalOpen(true)}
              iconPosition="end"
              icon={<InfoCircleOutlined />}
            >
              63b5a9f3-000f-473a-8c83-4c1b62fc2f37
            </Button>
          </Space>
          <Space>
            <Button
              onClick={handleOutgoingStream}
              shape="circle"
              icon={<VideoCameraOutlined />}
            />
          </Space>
        </Flex>
      </Flex>
      <InformationModal
        isOpen={isInformationModalOpen}
        handleClose={() => setIsInformationModalOpen(false)}
      />
    </>
  );
}

export default Header;
