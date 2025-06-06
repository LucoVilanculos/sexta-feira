import { api, ApiResponse } from '../axios';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  userId: string;
  createdAt: string;
}

export interface ChatResponse {
  message: Message;
  actions?: {
    type: 'CREATE_TASK' | 'CREATE_EVENT' | 'UPDATE_TASK' | 'UPDATE_EVENT';
    data: any;
  }[];
}

export interface SendMessageDTO {
  content: string;
  contextData?: {
    tasks?: any[];
    events?: any[];
    userPreferences?: any;
  };
}

export const chatService = {
  async sendMessage(data: SendMessageDTO): Promise<ApiResponse<ChatResponse>> {
    const response = await api.post<ApiResponse<ChatResponse>>('/chat/message', data);
    return response.data;
  },

  async getHistory(): Promise<ApiResponse<Message[]>> {
    const response = await api.get<ApiResponse<Message[]>>('/chat/history');
    return response.data;
  },

  async deleteMessage(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/chat/messages/${id}`);
    return response.data;
  },

  async clearHistory(): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>('/chat/history');
    return response.data;
  }
}; 