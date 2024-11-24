import React from "react";
import { useIsSmallScreenNoticeOpen, useStoreActions } from "@common/store";
import { Modal, Typography } from "antd";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
const { Text } = Typography;

function SmallScreenNotice() {
  const { updateIsSmallScreenNoticeOpen } = useStoreActions();
  const isSmallScreenNoticeOpen = useIsSmallScreenNoticeOpen();
  const screens = useBreakpoint();

  const isExtraSmallScreen = screens.xs;

  const isOpen = isSmallScreenNoticeOpen && isExtraSmallScreen;

  const handleClose = () => {
    updateIsSmallScreenNoticeOpen(false);
  };

  return (
    <Modal
      title="Small Screens Support Notice"
      open={isOpen}
      onOk={handleClose}
      onCancel={handleClose}
      okText="Got it"
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <Text>
        Video chat support on small screens is still in progress. The layout and
        functionality may not work as intended.
      </Text>
    </Modal>
  );
}

export default SmallScreenNotice;
