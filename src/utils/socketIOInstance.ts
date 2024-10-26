import io, { Socket } from "socket.io-client";
import { EventEmitter } from "events";

interface SocketIOClientConfig {
  // token: string;
  url: string;
  query: any;
}

export default class SocketIoClient extends EventEmitter {
  config!: SocketIOClientConfig;
  socket!: Socket;

  constructor(config: SocketIOClientConfig) {
    super();
    this.config = config;
    if (this.config.query) {
      this._connect();
    }
  }

  get IsConnected() {
    return this.socket && this.socket.connected;
  }

  private _connect() {
    const connectOptions = {
      autoConnect: true,
      forceNew: false,
      reconnection: false,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 3000,
      withCredentials: false,
      transports: ["websocket"],
      ...this.config,
    };

    this.socket = io("https://localhost:3600/", connectOptions);

    this.socket.on("connect", () => {
      this.emit("connect", this.socket);
    });

    this.socket.on("disconnect", (reason: unknown) => {
      console.warn("socketIO disconnected ", reason);
      this.emit("disconnect", reason);
    });
  }

  public disconnect() {
    console.warn("Disconnected method called on socketIO client!");
    this.socket.disconnect();
  }

  public subscribe(event: string, callback: (data: unknown) => void) {
    this.socket.on(event, callback);
  }

  public send(event: string, data: unknown) {
    this.socket.emit(event, data);
  }
}
