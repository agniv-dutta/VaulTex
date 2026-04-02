import type { Role } from '@prisma/client';
import { AppError } from '../../lib/errors';
import { serializeUser, type ApiUser } from '../../lib/serializers';
import { usersRepository } from './users.repository';

export class UsersService {
  async listUsers(): Promise<ApiUser[]> {
    const users = await usersRepository.list();
    return users.map(serializeUser);
  }

  async getUserById(id: string): Promise<ApiUser> {
    const user = await usersRepository.findById(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return serializeUser(user);
  }

  async updateRole(id: string, role: Role): Promise<ApiUser> {
    const existingUser = await usersRepository.findById(id);

    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    const updatedUser = await usersRepository.updateRole(id, role);
    return serializeUser(updatedUser);
  }
}

export const usersService = new UsersService();
