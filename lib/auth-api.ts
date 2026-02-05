import { apiRequest, LoginRequest, LoginResponse } from './api';

export const authApi = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }
};
