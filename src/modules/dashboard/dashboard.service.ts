import type { Role } from '@prisma/client';
import { recordsService, type CategoryBreakdownItem, type DashboardSummary, type MonthlyBreakdownItem } from '../records/records.service';

export class DashboardService {
  async summary(user: { id: string; role: Role }): Promise<DashboardSummary> {
    return recordsService.summary(user);
  }

  async byCategory(user: { id: string; role: Role }): Promise<CategoryBreakdownItem[]> {
    return recordsService.byCategory(user);
  }

  async monthly(user: { id: string; role: Role }): Promise<MonthlyBreakdownItem[]> {
    return recordsService.monthly(user);
  }
}

export const dashboardService = new DashboardService();
