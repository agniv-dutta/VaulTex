import type { DbFinancialRecord, DbUser } from '../types/domain';

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: DbUser['role'];
  createdAt: string;
  updatedAt: string;
}

export interface ApiFinancialRecord {
  id: string;
  userId: string;
  amount: number;
  type: DbFinancialRecord['type'];
  category: string;
  date: string;
  notes: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

const toNumber = (value: number | { toNumber(): number }): number =>
  typeof value === 'number' ? value : value.toNumber();

export const serializeUser = (user: DbUser): ApiUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString()
});

export const serializeFinancialRecord = (record: DbFinancialRecord): ApiFinancialRecord => ({
  id: record.id,
  userId: record.userId,
  amount: toNumber(record.amount),
  type: record.type,
  category: record.category,
  date: record.date.toISOString(),
  notes: record.notes,
  isDeleted: record.isDeleted,
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString()
});
