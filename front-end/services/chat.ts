import { api } from "@/lib/api";
import { Chat, Message } from "@/types/chat";

export const ChatApi = {
  async sendMessage(message: string): Promise<Message> {
    const response = await api.post("/api/chat", { message });
    return response.data;
  },

  async getChats(): Promise<Chat[]> {
    const response = await api.get("/api/chat");
    return response.data;
  },

  async getChat(id: string): Promise<Chat> {
    const response = await api.get(`/api/chat/${id}`);
    return response.data;
  }
};

export async function sendChatMessage(message: string): Promise<Message> {
  return ChatApi.sendMessage(message);
} 