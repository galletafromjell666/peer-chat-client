import { useContext } from "react";
import { socketIoContext } from "../contexts/socketIOContext";

export function useSocketIoClientContextValue() {
  return useContext(socketIoContext);
}
