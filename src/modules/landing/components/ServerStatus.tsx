import { getServerStatusMessages } from "@common/utils/constants";
import { Result, Spin } from "antd";

import useServerStatus from "../hooks/useServerStatus";

import SectionContainer from "./SectionContainer";


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
