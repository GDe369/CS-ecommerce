import {
  HubConnectionBuilder,
  HttpTransportType,
  LogLevel,
  HubConnectionState,
} from "@microsoft/signalr";
import apiClient, { BACKEND_HOST } from "./apiClient";

const backendHost =
  import.meta.env.VITE_BACKEND_URL ||
  apiClient.defaults.baseURL?.replace(/\/api\/?$/, "") ||
  BACKEND_HOST;

const getHubUrl = () => {
  if (import.meta.env.DEV && !import.meta.env.VITE_BACKEND_URL) {
    return "/chatHub";
  }

  return `${backendHost}/chatHub`;
};

let connection = null;
let receiveHandler = null;
let useWebSocketConnection = false;

const buildConnection = (useWebSockets = false) => {
  const token = localStorage.getItem("tech3d_token");
  const hubUrl = getHubUrl();
  const options = {
    accessTokenFactory: () => token,
    withCredentials: true,
  };

  if (useWebSockets) {
    options.transport = HttpTransportType.WebSockets;
    options.skipNegotiation = true;
  }

  const conn = new HubConnectionBuilder()
    .withUrl(hubUrl, options)
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Warning)
    .build();

  conn.onclose((error) => {
    if (error) {
      console.warn("SignalR connection closed:", error);
    }
  });

  useWebSocketConnection = useWebSockets;
  return conn;
};

export const createSignalRConnection = (useWebSockets = false) => {
  if (
    connection &&
    connection.state !== HubConnectionState.Disconnected &&
    useWebSocketConnection === useWebSockets
  ) {
    return connection;
  }

  connection = null;
  connection = buildConnection(useWebSockets);
  return connection;
};

export const startSignalRConnection = async (userId, onReceiveMessage) => {
  let conn = createSignalRConnection(false);

  if (receiveHandler) {
    conn.off("ReceiveMessage", receiveHandler);
    receiveHandler = null;
  }

  receiveHandler = (message) => {
    if (typeof onReceiveMessage === "function") {
      onReceiveMessage(message);
    }
  };

  conn.on("ReceiveMessage", receiveHandler);

  if (conn.state === HubConnectionState.Disconnected) {
    try {
      await conn.start();
    } catch (error) {
      console.warn("SignalR start failed for hub URL:", getHubUrl(), error);
      connection = null;
      conn = createSignalRConnection(true);
      conn.on("ReceiveMessage", receiveHandler);
      try {
        await conn.start();
      } catch (fallbackError) {
        console.error(
          "SignalR fallback websocket start also failed for hub URL:",
          getHubUrl(),
          fallbackError,
        );
        throw fallbackError;
      }
    }
  }

  if (userId) {
    conn.invoke("JoinGroup", `User_${userId}`).catch((error) => {
      console.warn("SignalR JoinGroup failed:", error);
    });
  }

  return conn;
};

export const stopSignalRConnection = async () => {
  if (!connection) return;

  if (receiveHandler) {
    connection.off("ReceiveMessage", receiveHandler);
    receiveHandler = null;
  }

  try {
    await connection.stop();
  } catch (error) {
    console.warn("SignalR stop failed:", error);
  }

  connection = null;
};
