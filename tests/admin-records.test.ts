import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { app } from '../src/app';
import { prisma } from '../src/config/prisma';
import { hashPassword } from '../src/lib/password';
import { resetDatabase } from './helpers';

const seedUser = async (email: string, role: 'ADMIN' | 'ANALYST' | 'VIEWER') =>
  prisma.user.create({
    data: {
      name: `${role} User`,
      email,
      password: await hashPassword('Password123!'),
      role
    }
  });

describe('admin record crud', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('allows admin to create update and soft delete a record', async () => {
    const admin = await seedUser('admin@example.com', 'ADMIN');
    const viewer = await seedUser('viewer@example.com', 'VIEWER');

    const login = await request(app).post('/api/auth/login').send({
      email: admin.email,
      password: 'Password123!'
    });

    const createResponse = await request(app)
      .post('/api/records')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send({
        userId: viewer.id,
        amount: 500,
        type: 'INCOME',
        category: 'Salary',
        date: '2024-01-05',
        notes: 'Initial entry'
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.data.userId).toBe(viewer.id);

    const recordId = createResponse.body.data.id as string;

    const updateResponse = await request(app)
      .patch(`/api/records/${recordId}`)
      .set('Authorization', `Bearer ${login.body.token}`)
      .send({
        amount: 650,
        notes: 'Updated entry'
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.amount).toBe(650);
    expect(updateResponse.body.data.notes).toBe('Updated entry');

    const deleteResponse = await request(app)
      .delete(`/api/records/${recordId}`)
      .set('Authorization', `Bearer ${login.body.token}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.data.isDeleted).toBe(true);

    const getResponse = await request(app)
      .get(`/api/records/${recordId}`)
      .set('Authorization', `Bearer ${login.body.token}`);

    expect(getResponse.status).toBe(404);
  });

  it('blocks non-admin from creating records', async () => {
    const analyst = await seedUser('analyst@example.com', 'ANALYST');
    const viewer = await seedUser('viewer2@example.com', 'VIEWER');

    const login = await request(app).post('/api/auth/login').send({
      email: analyst.email,
      password: 'Password123!'
    });

    const createResponse = await request(app)
      .post('/api/records')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send({
        userId: viewer.id,
        amount: 250,
        type: 'EXPENSE',
        category: 'Rent',
        date: '2024-02-01'
      });

    expect(createResponse.status).toBe(403);
  });
});
