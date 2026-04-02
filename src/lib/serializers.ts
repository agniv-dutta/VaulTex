import type { FinancialRecord, User } from '@prisma/client';

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: User['role'];
  createdAt: string;
  updatedAt: string;
}

export interface ApiFinancialRecord {
  id: string;
  userId: string;
  amount: number;
  type: FinancialRecord['type'];
  category: string;
  date: string;
  notes: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export const serializeUser = (user: User): ApiUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString()
});

export const serializeFinancialRecord = (record: FinancialRecord): ApiFinancialRecord => ({
  id: record.id,
  userId: record.userId,
  amount: Number(record.amount),
  type: record.type,
  category: record.category,
  date: record.date.toISOString(),
  notes: record.notes,
  isDeleted: record.isDeleted,
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString()
});
