import type { Role } from '@prisma/client';

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface AuthenticatedUser extends AuthTokenPayload {
  id: string;
  userId: string;
}
