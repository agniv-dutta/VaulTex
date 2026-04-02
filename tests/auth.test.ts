import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { app } from '../src/app';
import { prisma } from '../src/config/prisma';
import { resetDatabase } from './helpers';

describe('auth flow', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('registers a user and returns a token', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'Viewer One',
      email: 'viewer@example.com',
      password: 'Password123!'
    });

    expect(response.status).toBe(201);
    expect(response.body.token).toBeTypeOf('string');
    expect(response.body.user.email).toBe('viewer@example.com');
    expect(response.body.user.role).toBe('VIEWER');
  });

  it('rejects invalid login credentials', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Viewer One',
      email: 'viewer@example.com',
      password: 'Password123!'
    });

    const response = await request(app).post('/api/auth/login').send({
      email: 'viewer@example.com',
      password: 'wrong-password'
    });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Invalid credentials');
  });
});
