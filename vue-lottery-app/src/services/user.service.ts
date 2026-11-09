import { http } from '../api/http-client';
import type { User, CreateUserDto, UpdateUserDto, UsersResponse } from '../types/user';
import type { Readable, Creatable, Editable, Deletable } from './interfaces';

export class UserService
  implements Readable<User>, Creatable<User, CreateUserDto>, Editable<User, UpdateUserDto>, Deletable
{
  async getAll(params: { limit?: number; skip?: number; q?: string } = {}): Promise<User[]> {
    const { limit = 10, skip = 0, q = '' } = params;
    const url = q
      ? `/users/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`
      : `/users?limit=${limit}&skip=${skip}`;
    const data = await http<UsersResponse>(url);
    return data.users;
  }

  async getWithTotal(params: { limit?: number; skip?: number; q?: string } = {}): Promise<UsersResponse> {
    const { limit = 10, skip = 0, q = '' } = params;
    const url = q
      ? `/users/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`
      : `/users?limit=${limit}&skip=${skip}`;
    return http<UsersResponse>(url);
  }

  getById(id: number): Promise<User> {
    return http<User>(`/users/${id}`);
  }

  create(data: CreateUserDto): Promise<User> {
    return http<User>('/users/add', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  update(id: number, data: UpdateUserDto): Promise<User> {
    return http<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(id: number): Promise<void> {
    await http(`/users/${id}`, { method: 'DELETE' });
  }
}
