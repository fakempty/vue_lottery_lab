import { http } from '../api/http-client';
import type { LoginResponse } from '../types/auth';
import type { User } from '../types/user';

export class AuthService {
  login(credentials: { username: string; password: string }): Promise<LoginResponse> {
    return http<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  getCurrentUser(): Promise<User> {
    return http<User>('/auth/me');
  }
}
