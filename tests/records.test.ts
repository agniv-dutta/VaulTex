import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { Role } from '@prisma/client';
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

describe('records access control', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('restricts viewers to their own records', async () => {
    const viewer = await seedUser('viewer@example.com', 'VIEWER');
    const analyst = await seedUser('analyst@example.com', 'ANALYST');
    await prisma.financialRecord.create({
      data: {
        userId: analyst.id,
        amount: 100,
        type: 'INCOME',
        category: 'Salary',
        date: new Date('2024-01-01')
      }
    });

    const login = await request(app).post('/api/auth/login').send({
      email: viewer.email,
      password: 'Password123!'
    });

    const response = await request(app).get('/api/records').set('Authorization', `Bearer ${login.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(0);
  });

  it('allows analyst to read all records', async () => {
    const analyst = await seedUser('analyst@example.com', 'ANALYST');
    const viewer = await seedUser('viewer@example.com', 'VIEWER');
    await prisma.financialRecord.create({
      data: {
        userId: viewer.id,
        amount: 125,
        type: 'EXPENSE',
        category: 'Rent',
        date: new Date('2024-01-01')
      }
    });

    const login = await request(app).post('/api/auth/login').send({
      email: analyst.email,
      password: 'Password123!'
    });

    const response = await request(app).get('/api/records').set('Authorization', `Bearer ${login.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });
});
