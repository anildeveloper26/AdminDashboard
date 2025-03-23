// src/services/api.ts
import axios from 'axios';
import { User } from '../types';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const userToken = localStorage.getItem('userToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  else if (userToken) config.headers.Authorization = `Bearer ${userToken}`;
  return config;
});

interface AuthResponse {
  token: string;
  user: Partial<User>;
}

export const userAuth = {
  userSignup: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/client/signup', { username, email, password });
    return response.data;
  },
  userLogin: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/client/login', { email, password });
    return response.data;
  },
};

export const auth = {
  signup: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', { username, email, password });
    return response.data;
  },
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};