import type { Role, RecordType } from '../../types/domain';
import { AppError } from '../../lib/errors';
import { endOfUtcDay, startOfUtcDay } from '../../lib/date';
import { serializeFinancialRecord, type ApiFinancialRecord } from '../../lib/serializers';
import { recordsRepository } from './records.repository';

export interface RecordsListResult {
  data: ApiFinancialRecord[];
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
  month: string;
  income: number;
  expense: number;
  total: number;
}

export class RecordsService {
  private buildAccessFilter(user: { id: string; role: Role }) {
    return user.role === 'VIEWER' ? { userId: user.id } : {};
  }

  async createRecord(input: {
    userId: string;
    amount: number;
    type: RecordType;
    category: string;
    date: string;
    notes?: string | null;
  }): Promise<ApiFinancialRecord> {
    const record = await recordsRepository.create({
      ...input,
      date: new Date(input.date)
    });

    return serializeFinancialRecord(record);
  }

  async listRecords(user: { id: string; role: Role }, query: {
    type?: RecordType;
    category?: string;
    startDate?: string;
    endDate?: string;
    page: number;
    limit: number;
  }): Promise<RecordsListResult> {
    const filter = {
      ...this.buildAccessFilter(user),
      ...(query.type ? { type: query.type } : {}),
      ...(query.category ? { category: query.category } : {}),
      ...(query.startDate ? { startDate: startOfUtcDay(query.startDate) } : {}),
      ...(query.endDate ? { endDate: endOfUtcDay(query.endDate) } : {})
    };

    const result = await recordsRepository.list(filter, query.page, query.limit);

    return {
      data: result.records.map(serializeFinancialRecord),
      meta: {
        page: query.page,
        limit: query.limit,
        total: result.total,
        totalPages: Math.max(1, Math.ceil(result.total / query.limit))
      }
    };
  }

  async getRecordById(user: { id: string; role: Role }, id: string): Promise<ApiFinancialRecord> {
    const record = await recordsRepository.findById(id);

    if (!record) {
      throw new AppError('Record not found', 404);
    }

    if (user.role === 'VIEWER' && record.userId !== user.id) {
      throw new AppError('Forbidden', 403);
    }

    return serializeFinancialRecord(record);
  }

  async updateRecord(id: string, input: {
    userId?: string;
    amount?: number;
    type?: RecordType;
    category?: string;
    date?: string;
    notes?: string | null;
    isDeleted?: boolean;
  }): Promise<ApiFinancialRecord> {
    const existingRecord = await recordsRepository.findById(id);

    if (!existingRecord) {
      throw new AppError('Record not found', 404);
    }

    const { date, ...rest } = input;
    const updatedRecord = await recordsRepository.update(id, {
      ...rest,
      ...(date ? { date: new Date(date) } : {})
    });

    return serializeFinancialRecord(updatedRecord);
  }

  async deleteRecord(id: string): Promise<ApiFinancialRecord> {
    const existingRecord = await recordsRepository.findById(id);

    if (!existingRecord) {
      throw new AppError('Record not found', 404);
    }

    const deletedRecord = await recordsRepository.softDelete(id);
    return serializeFinancialRecord(deletedRecord);
  }

  async summary(user: { id: string; role: Role }): Promise<DashboardSummary> {
    const records = await recordsRepository.fetchAllForAnalytics(this.buildAccessFilter(user));
    return this.aggregateSummary(records.map(serializeFinancialRecord));
  }

  async byCategory(user: { id: string; role: Role }): Promise<CategoryBreakdownItem[]> {
    const records = await recordsRepository.fetchAllForAnalytics(this.buildAccessFilter(user));
    const grouped = new Map<string, CategoryBreakdownItem>();

    for (const record of records) {
      const entry = grouped.get(record.category) ?? {
        category: record.category,
        income: 0,
        expense: 0,
        total: 0
      };

      if (record.type === 'INCOME') {
        entry.income += Number(record.amount);
      } else {
        entry.expense += Number(record.amount);
      }

      entry.total += Number(record.amount);
      grouped.set(record.category, entry);
    }

    return [...grouped.values()].sort((left, right) => right.total - left.total);
  }

  async monthly(user: { id: string; role: Role }): Promise<MonthlyBreakdownItem[]> {
    const records = await recordsRepository.fetchAllForAnalytics(this.buildAccessFilter(user));
    const monthlyGroups = new Map<string, MonthlyBreakdownItem>();

    const months = this.generateLastTwelveMonths();
    for (const month of months) {
      monthlyGroups.set(month, { month, income: 0, expense: 0, total: 0 });
    }

    for (const record of records) {
      const month = record.date.toISOString().slice(0, 7);
      const entry = monthlyGroups.get(month);

      if (!entry) {
        continue;
      }

      if (record.type === 'INCOME') {
        entry.income += Number(record.amount);
      } else {
        entry.expense += Number(record.amount);
      }

      entry.total += Number(record.amount);
    }

    return [...monthlyGroups.values()];
  }

  private aggregateSummary(records: ApiFinancialRecord[]): DashboardSummary {
    return records.reduce<DashboardSummary>(
      (summary, record) => {
        if (record.type === 'INCOME') {
          summary.totalIncome += record.amount;
        } else {
          summary.totalExpenses += record.amount;
        }

        summary.netBalance = summary.totalIncome - summary.totalExpenses;
        return summary;
      },
      { totalIncome: 0, totalExpenses: 0, netBalance: 0 }
    );
  }

  private generateLastTwelveMonths(): string[] {
    const months: string[] = [];
    const now = new Date();

    for (let offset = 11; offset >= 0; offset -= 1) {
      const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1));
      months.push(date.toISOString().slice(0, 7));
    }

    return months;
  }
}

export const recordsService = new RecordsService();
