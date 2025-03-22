import axios from 'axios';
import { User } from '../types';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

interface AuthResponse {
  token: string;
  user: Partial<User>;
}

export const auth = {
  signup: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', { username, email, password });
    return response.data;
  },
};