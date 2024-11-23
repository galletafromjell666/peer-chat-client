import { createContext } from "react";
import SocketIoClient, {
  SocketIOClientConfig,
} from "@common/utils/socketIOInstance";

export const socketIoContext = createContext<{
  client: SocketIoClient | null;
  setConfig: React.Dispatch<
    React.SetStateAction<SocketIOClientConfig | undefined>
  > | null;
}>({ client: null, setConfig: null });
