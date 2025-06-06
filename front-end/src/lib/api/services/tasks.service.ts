import { api, ApiResponse } from '../axios';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: Task['priority'];
}

export interface UpdateTaskDTO extends Partial<CreateTaskDTO> {
  completed?: boolean;
}

export const tasksService = {
  async getAll(): Promise<ApiResponse<Task[]>> {
    const response = await api.get<ApiResponse<Task[]>>('/tasks');
    return response.data;
  },

  async getById(id: string): Promise<ApiResponse<Task>> {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data;
  },

  async create(data: CreateTaskDTO): Promise<ApiResponse<Task>> {
    const response = await api.post<ApiResponse<Task>>('/tasks', data);
    return response.data;
  },

  async update(id: string, data: UpdateTaskDTO): Promise<ApiResponse<Task>> {
    const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/tasks/${id}`);
    return response.data;
  },

  async toggleComplete(id: string): Promise<ApiResponse<Task>> {
    const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}/toggle`);
    return response.data;
  }
}; 