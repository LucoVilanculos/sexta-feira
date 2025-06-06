import { api, ApiResponse } from '../axios';

export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  type: 'MEETING' | 'TASK' | 'REMINDER' | 'OTHER';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventDTO {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  type: Event['type'];
}

export interface UpdateEventDTO extends Partial<CreateEventDTO> {}

export const eventsService = {
  async getAll(): Promise<ApiResponse<Event[]>> {
    const response = await api.get<ApiResponse<Event[]>>('/events');
    return response.data;
  },

  async getById(id: string): Promise<ApiResponse<Event>> {
    const response = await api.get<ApiResponse<Event>>(`/events/${id}`);
    return response.data;
  },

  async create(data: CreateEventDTO): Promise<ApiResponse<Event>> {
    const response = await api.post<ApiResponse<Event>>('/events', data);
    return response.data;
  },

  async update(id: string, data: UpdateEventDTO): Promise<ApiResponse<Event>> {
    const response = await api.patch<ApiResponse<Event>>(`/events/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/events/${id}`);
    return response.data;
  },

  async getByDateRange(startDate: string, endDate: string): Promise<ApiResponse<Event[]>> {
    const response = await api.get<ApiResponse<Event[]>>('/events/range', {
      params: { startDate, endDate }
    });
    return response.data;
  }
}; 