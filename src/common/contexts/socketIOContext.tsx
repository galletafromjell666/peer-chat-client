import { createContext } from "react";
import SocketIoClient from "@common/utils/socketIOInstance";


export const socketIoContext = createContext<{
  client: SocketIoClient | null;
  setConfig: any;
}>({ client: null, setConfig: null });
