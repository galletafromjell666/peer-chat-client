import { useState } from "react";
import { Button, Card, Flex, Input, Typography } from "antd";
import { isEmpty } from "lodash";

const { Text } = Typography;

function CreateAndJoin() {
  const [joinConferenceId, setJoinConferenceId] = useState("");

  const handleJoinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJoinConferenceId(e.target.value);
  };

  const isConferenceIdValid =
    !isEmpty(joinConferenceId) && joinConferenceId.length > 5;

  return (
    <Flex
      justify="center"
      align="center"
      style={{
        width: "100dvw",
        height: "100dvh",
      }}
    >
      <Card style={{ width: 300 }}>
        <Flex vertical gap={16} justify="center">
          <Flex vertical gap={8}>
            <Input
              size="large"
              placeholder="Conference ID"
              value={joinConferenceId}
              onChange={handleJoinInput}
            />
            <Button size="large" disabled={!isConferenceIdValid}>
              Join a conference
            </Button>
          </Flex>
          <Text style={{ alignSelf: "center" }} strong>
            Or
          </Text>
          <Button size="large" type="primary">
            Create a conference
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
}

export default CreateAndJoin;
