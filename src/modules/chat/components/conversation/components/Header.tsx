import { useState } from "react";
import { useParams } from "react-router-dom";
import { InfoCircleOutlined, VideoCameraOutlined } from "@ant-design/icons";
import useMediaStreamActions from "@common/hooks/useMediaStreamActions";
import { useOutgoingMediaStream } from "@common/hooks/useMediaStreamStore";
import { useIsPeerConnected } from "@common/store";
import { mediaDevicesErrorAccessMessage } from "@common/utils/constants";
import { Button, Flex, notification, Space, theme } from "antd";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { isNil } from "lodash";

import InformationModal from "./InformationModal";

const { useToken } = theme;
const { useNotification } = notification;

function Header() {
  const params = useParams();
  const { token } = useToken();
  const screens = useBreakpoint();
  const isPeerConnected = useIsPeerConnected();

  const [msg, contextHolder] = useNotification();
  const outgoingMediaStream = useOutgoingMediaStream();
  const { addMediaStreamToRTCConnection, removeMediaStreamToRTCConnection } =
    useMediaStreamActions();

  const [isInformationModalOpen, setIsInformationModalOpen] = useState(false);
  const hasOutgoingStream = !isNil(outgoingMediaStream);

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

  const chatId = params.chatId;

  const isSmallScreen = (screens.sm || screens.xs) && !screens.md;

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
              style={
                isSmallScreen
                  ? {
                      fontWeight: "600",
                      fontStyle: "italic",
                    }
                  : {}
              }
            >
              {!isSmallScreen ? chatId : "PeerChat"}
            </Button>
          </Space>
          <Space>
            <Button
              disabled={!isPeerConnected}
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
