import { useParams } from "react-router-dom";
import { useSocketIoClientContextValue } from "../../../../common/hooks/useSocketIOContextValue";
import { useEffect } from "react";
import { useSocketIOConfigActions } from "../../../../common/hooks/useSocketIOConfigActions";

// TODO: check if the room exists or is it full and if not show a toast or something while redirecting
function Conversation() {
  const { client: socketIOClient } = useSocketIoClientContextValue();
  const socketIOActions = useSocketIOConfigActions();
  const params = useParams();
  useEffect(() => {
    console.log("Mounting conversation component, chat id", params?.chatId);
    console.log(params?.chatId, socketIOClient);
    if (!socketIOClient) {
      console.log(
        "Empty socketIOClient, this means the user is joiningx a chat!!"
      );
      socketIOActions.joinRoom();
    }

    return () => {};
  }, [params?.chatId, socketIOActions, socketIOClient]);

  return <div>index</div>;
}

export default Conversation;
