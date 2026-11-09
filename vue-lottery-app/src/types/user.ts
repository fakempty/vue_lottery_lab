export interface User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  image?: string;
}

export type CreateUserDto = Omit<User, 'id' | 'image'> & { password?: string };
export type UpdateUserDto = Partial<CreateUserDto>;

export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}
