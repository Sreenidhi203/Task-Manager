export interface AuthUser {
  id?: number;
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  id?: number;
  token: string;
  type: string;
  username: string;
  email: string;
  role: string;
}
