import { useState } from "react";
import Child from "./Child";

function App() {
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    console.log("TO DO!");
  };

  return (
    <div>
      <Child />
      <h1>peer-chat-client!</h1>
      <input placeholder="Message" />
      <button onClick={sendMessage}>Send message</button>
      <h1>Messages:</h1>
      {messages.map((m) => (
        <p>{m}</p>
      ))}
    </div>
  );
}

export default App;
