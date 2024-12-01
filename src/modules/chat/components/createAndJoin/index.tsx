import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocketIOConfigActions } from "@common/hooks/useSocketIOConfigActions";
import { Button, Card, Flex, Input, theme, Typography } from "antd";
import { isEmpty } from "lodash";

const { Text } = Typography;
const { useToken } = theme;

function CreateAndJoin() {
  const [joinConferenceId, setJoinConferenceId] = useState("");
  const socketIOActions = useSocketIOConfigActions();
  const navigate = useNavigate();
  const { token } = useToken();

  useEffect(() => {
    return () => {};
  }, []);

  const handleCreate = () => {
    socketIOActions.createRoom();
  };

  const handleJoin = () => {
    navigate(`/chat/${joinConferenceId}`);
  };

  const handleJoinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJoinConferenceId(e.target.value);
  };

  // TODO: Update this to use the real value!!
  const isConferenceIdValid =
    !isEmpty(joinConferenceId) && joinConferenceId.length > 1;

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
              placeholder="Chat room ID"
              value={joinConferenceId}
              style={{ textAlign: "center" }}
              onChange={handleJoinInput}
            />
            <Button
              size="large"
              disabled={!isConferenceIdValid}
              onClick={handleJoin}
            >
              Join a chat room
            </Button>
          </Flex>
          <Text style={{ alignSelf: "center" }} strong>
            Or
          </Text>
          <Button size="large" type="primary" onClick={handleCreate}>
            Create a chat room
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
}

export default CreateAndJoin;
