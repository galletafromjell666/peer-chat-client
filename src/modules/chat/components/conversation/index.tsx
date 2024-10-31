import { useParams } from "react-router-dom";

// TODO: check if the room exists or is it full and if not show a toast or something while redirecting
function Conversation() {
  const params = useParams();
  console.log("chat id: ", params?.chatId);
  return <div>index</div>;
}

export default Conversation;
