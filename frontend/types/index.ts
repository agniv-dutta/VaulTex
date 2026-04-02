export type Role = "VIEWER" | "ANALYST" | "ADMIN";
export type RecordType = "INCOME" | "EXPENSE";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface FinancialRecord {
  id: string;
  userId: string;
  amount: number;
  type: RecordType;
  category: string;
  date: string;
  notes?: string | null;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecordsListResult {
  data: FinancialRecord[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
}

export interface CategoryBreakdownItem {
  category: string;
  income: number;
  expense: number;
  total: number;
}

export interface MonthlyBreakdownItem {
  month: string; // YYYY-MM
  income: number;
  expense: number;
  total: number;
}

