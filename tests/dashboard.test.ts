import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import type { Role } from '../src/types/domain';
import { app } from '../src/app';
import { prisma } from '../src/config/prisma';
import { hashPassword } from '../src/lib/password';
import { resetDatabase } from './helpers';

const seedUser = async (email: string, role: Role) =>
  prisma.user.create({
    data: {
      name: `${role} User`,
      email,
      password: await hashPassword('Password123!'),
      role
    }
  });

describe('dashboard analytics', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('returns own summary for viewers', async () => {
    const viewer = await seedUser('viewer@example.com', 'VIEWER');
    await prisma.financialRecord.createMany({
      data: [
        { userId: viewer.id, amount: 100, type: 'INCOME', category: 'Salary', date: new Date('2024-01-01') },
        { userId: viewer.id, amount: 25, type: 'EXPENSE', category: 'Food', date: new Date('2024-01-02') }
      ]
    });

    const login = await request(app).post('/api/auth/login').send({
      email: viewer.email,
      password: 'Password123!'
    });

    const response = await request(app).get('/api/dashboard/summary').set('Authorization', `Bearer ${login.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.totalIncome).toBe(100);
    expect(response.body.data.totalExpenses).toBe(25);
    expect(response.body.data.netBalance).toBe(75);
  });
});
