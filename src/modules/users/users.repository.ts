import type { DbUser, Role } from '../../types/domain';
import { prisma } from '../../config/prisma';

export class UsersRepository {
  async create(data: { name: string; email: string; password: string; role?: Role }): Promise<DbUser> {
    return prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<DbUser | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<DbUser | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async list(): Promise<DbUser[]> {
    return prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async updateRole(id: string, role: Role): Promise<DbUser> {
    return prisma.user.update({ where: { id }, data: { role } });
  }

  async count(): Promise<number> {
    return prisma.user.count();
  }
}

export const usersRepository = new UsersRepository();
