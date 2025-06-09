import { apiClient } from "@/lib/api";
import { Message } from "@/types/chat";

type Chat = any

export const ChatApi = {
 async sendMessage(message: string): Promise<Message> {
  const response = await apiClient.post<{ data: Message }>("/api/chat", { message });
  return response.data;
},

async getChats(): Promise<Chat> {
  const response = await apiClient.get<Chat>("/api/chat");
  return response.data;
},

async getChat(id: string): Promise<Chat> {
  const response = await apiClient.get<Chat>(`/api/chat/${id}`);
  return response.data;
}
};

export async function sendChatMessage(message: string): Promise<Message> {
  return ChatApi.sendMessage(message);
} 