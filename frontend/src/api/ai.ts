import api from "./axios";

export const sendMessageToAI = (message: string) =>
  api.post("ai/chat/", { message });