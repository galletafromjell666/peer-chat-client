import { useState } from "react";
import { isEmpty } from "lodash";
import { Button, Card, Flex, Input, Typography, theme } from "antd";
import { useSocketIOConfigActions } from "@common/hooks/useSocketIOConfigActions";


const { Text } = Typography;
const { useToken } = theme;

function CreateAndJoin() {
  const [joinConferenceId, setJoinConferenceId] = useState("");
  const socketIOActions = useSocketIOConfigActions();
  const { token } = useToken();

  const handleCreate = () => {
    socketIOActions.createRoom();
  };

  const handleJoin = () => {
    socketIOActions.joinRoom();
  };

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
        backgroundColor: token.colorPrimaryBg,
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
              style={{ textAlign: "center" }}
              onChange={handleJoinInput}
            />
            <Button
              size="large"
              disabled={!isConferenceIdValid}
              onClick={handleJoin}
            >
              Join a conference
            </Button>
          </Flex>
          <Text style={{ alignSelf: "center" }} strong>
            Or
          </Text>
          <Button size="large" type="primary" onClick={handleCreate}>
            Create a conference
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
}

export default CreateAndJoin;
