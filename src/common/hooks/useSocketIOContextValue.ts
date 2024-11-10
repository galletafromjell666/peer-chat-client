import { useContext } from "react";
import { socketIoContext } from "@common/contexts/socketIOContext";


export function useSocketIoClientContextValue() {
  return useContext(socketIoContext);
}
