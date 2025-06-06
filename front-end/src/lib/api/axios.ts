import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_TIMEOUT = Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000;

export const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const message = error.response?.data?.message || 'An error occurred';
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export type ApiError = {
  message: string;
  status: number;
};

export type ApiResponse<T> = {
  data: T;
  message: string;
  status: number;
}; 