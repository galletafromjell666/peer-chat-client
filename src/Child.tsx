import { Button } from "antd";
import { useSocketIOConfigActions } from "./common/hooks/useRTCAndSocketIOEvents";

function Child() {
  const x = useSocketIOConfigActions();
  const handleCreate = () => {
    x.createRoom();
  };

  const handleJoin = () => {
    x.joinRoom();
  };

  return (
    <div>
      <Button onClick={handleCreate}>Create Room 11</Button>
      <Button onClick={handleJoin}>Join Room 11</Button>
    </div>
  );
}

export default Child;
