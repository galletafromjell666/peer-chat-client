import { useContext } from "react";
import { socketIoContext } from "../contexts/socketIOContext";

export function useSocketIoClient() {
  return useContext(socketIoContext);
}
