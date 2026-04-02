import type { FinancialRecord, RecordType, Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';

export interface RecordFilter {
  userId?: string;
  type?: RecordType;
  category?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface PaginatedRecordsResult {
  records: FinancialRecord[];
  total: number;
}

export class RecordsRepository {
  private buildWhere(filter: RecordFilter = {}): Prisma.FinancialRecordWhereInput {
    return {
      isDeleted: false,
      ...(filter.userId ? { userId: filter.userId } : {}),
      ...(filter.type ? { type: filter.type } : {}),
      ...(filter.category ? { category: filter.category } : {}),
      ...(filter.startDate || filter.endDate
        ? {
            date: {
              ...(filter.startDate ? { gte: filter.startDate } : {}),
              ...(filter.endDate ? { lte: filter.endDate } : {})
            }
          }
        : {})
    };
  }

  async create(data: {
    userId: string;
    amount: number;
    type: RecordType;
    category: string;
    date: Date;
    notes?: string | null;
  }): Promise<FinancialRecord> {
    return prisma.financialRecord.create({
      data: {
        userId: data.userId,
        amount: data.amount,
        type: data.type,
        category: data.category,
        date: data.date,
        notes: data.notes ?? null
      }
    });
  }

  async findById(id: string): Promise<FinancialRecord | null> {
    return prisma.financialRecord.findFirst({
      where: {
        id,
        isDeleted: false
      }
    });
  }

  async findByIdIncludingDeleted(id: string): Promise<FinancialRecord | null> {
    return prisma.financialRecord.findUnique({ where: { id } });
  }

  async list(filter: RecordFilter, page: number, limit: number): Promise<PaginatedRecordsResult> {
    const where = this.buildWhere(filter);
    const [records, total] = await prisma.$transaction([
      prisma.financialRecord.findMany({
        where,
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.financialRecord.count({ where })
    ]);

    return { records, total };
  }

  async update(id: string, data: Partial<{
    userId: string;
    amount: number;
    type: RecordType;
    category: string;
    date: Date;
    notes: string | null;
    isDeleted: boolean;
  }>): Promise<FinancialRecord> {
    return prisma.financialRecord.update({ where: { id }, data });
  }

  async softDelete(id: string): Promise<FinancialRecord> {
    return prisma.financialRecord.update({ where: { id }, data: { isDeleted: true } });
  }

  async fetchAllForAnalytics(filter: RecordFilter = {}): Promise<FinancialRecord[]> {
    return prisma.financialRecord.findMany({
      where: this.buildWhere(filter),
      orderBy: { date: 'desc' }
    });
  }
}

export const recordsRepository = new RecordsRepository();
