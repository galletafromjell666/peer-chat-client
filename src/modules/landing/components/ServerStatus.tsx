import { Result, Spin } from "antd";

import useServerStatus from "../hooks/useServerStatus";

import SectionContainer from "./SectionContainer";

const getServerStatusMessages = (isSuccess: boolean) => {
  if (isSuccess) {
    return {
      title: "PeerChat server is up and running.",
      subTitle: " All systems are operational. Ready to connect securely.",
    };
  }
  return {
    title: "PeerChat server is currently unavailable.",
    subTitle: "Please try again later or check your connection settings.",
  };
};

function ServerStatus() {
  const { isLoading, isSuccess } = useServerStatus();

  const { title, subTitle } = getServerStatusMessages(!isLoading && isSuccess);
  return (
    <SectionContainer title="Server Status" isBordered justifyCenterChildren>
      {isLoading ? (
        <Spin size="large" />
      ) : (
        <Result
          status={isSuccess ? "success" : "error"}
          title={title}
          subTitle={subTitle}
        />
      )}
    </SectionContainer>
  );
}

export default ServerStatus;
