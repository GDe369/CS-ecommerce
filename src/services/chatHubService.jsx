import apiClient from "./apiClient";
import {
  HubConnectionBuilder,
  HttpTransportType,
  LogLevel,
  HubConnectionState,
} from "@microsoft/signalr";

const getBaseUrl = () => {
  const baseUrl = apiClient.defaults.baseURL || "";
  return baseUrl.replace(/\/api\/?$/, "") || window.location.origin;
};

export const createChatHubConnection = (token) => {
  const hubUrl = `${getBaseUrl()}/chatHub`;

  return new HubConnectionBuilder()
    .withUrl(hubUrl, {
      accessTokenFactory: () => token,
      transport: HttpTransportType.WebSockets,
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Error)
    .build();
};

export const joinUserGroup = async (connection, userId) => {
  if (!connection || connection.state !== HubConnectionState.Connected) return;
  try {
    await connection.invoke("JoinGroup", `User_${userId}`);
  } catch (error) {
    console.warn("SignalR join group failed:", error);
  }
};
