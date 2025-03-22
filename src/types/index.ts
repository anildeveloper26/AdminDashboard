export interface User {
  _id: string;
  username: string;
  email: string;
  password?: string;
  role: 'admin' | 'editor' | 'viewer';
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: Partial<User>;
}