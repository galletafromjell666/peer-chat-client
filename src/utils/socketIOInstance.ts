import io, { Socket } from "socket.io-client";
import { EventEmitter } from "events";

interface SocketIOClientConfig {
  // token: string;
  url: string;
}

export default class SocketIoClient extends EventEmitter {
  config!: SocketIOClientConfig;
  socket!: Socket;

  constructor(config: SocketIOClientConfig) {
    super();
    this.config = config;
    this._connect();
  }

  get IsConnected() {
    return this.socket && this.socket.connected;
  }

  private _connect() {
    const connectOptions = {
      autoConnect: true,
      forceNew: false,
      // TODO: Add room here.
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 3000,
      withCredentials: true,
      transports: ["websocket"],
    };

    this.socket = io(this.config.url, connectOptions);

    this.socket.on("connect", () => {
      this.emit("connect", this.socket);
    });

    this.socket.on("disconnect", (reason: unknown) => {
      console.warn("socketIO disconnected ", reason);
      this.emit("disconnect", reason);
    });
  }

  public subscribe(event: string, callback: (data: unknown) => void) {
    this.socket.on(event, callback);
  }

  public send(event: string, data: unknown) {
    this.socket.emit(event, data);
  }
}
