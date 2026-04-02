export type Role = 'VIEWER' | 'ANALYST' | 'ADMIN';

export type RecordType = 'INCOME' | 'EXPENSE';

export interface DecimalLike {
  toNumber(): number;
  toString(): string;
}

export interface DbUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbFinancialRecord {
  id: string;
  userId: string;
  amount: number | DecimalLike;
  type: RecordType;
  category: string;
  date: Date;
  notes: string | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
