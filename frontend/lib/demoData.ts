import type {
  CategoryBreakdownItem,
  DashboardSummary,
  FinancialRecord,
  MonthlyBreakdownItem,
} from "@/types";

type DemoMonth = {
  month: string;
  income: number;
  expenses: Array<{
    category: string;
    amount: number;
    notes: string;
  }>;
};

const DEMO_MONTHS: DemoMonth[] = [
  {
    month: "2025-05",
    income: 8200,
    expenses: [
      { category: "Rent", amount: 2100, notes: "Monthly rent" },
      { category: "Groceries", amount: 620, notes: "Weekend grocery run" },
      { category: "Transport", amount: 180, notes: "Fuel and transit" },
    ],
  },
  {
    month: "2025-06",
    income: 8450,
    expenses: [
      { category: "Rent", amount: 2100, notes: "Monthly rent" },
      { category: "Utilities", amount: 260, notes: "Electricity and internet" },
      { category: "Entertainment", amount: 340, notes: "Streaming and tickets" },
    ],
  },
  {
    month: "2025-07",
    income: 8300,
    expenses: [
      { category: "Rent", amount: 2100, notes: "Monthly rent" },
      { category: "Groceries", amount: 680, notes: "Supermarket stock-up" },
      { category: "Healthcare", amount: 190, notes: "Pharmacy" },
    ],
  },
  {
    month: "2025-08",
    income: 8600,
    expenses: [
      { category: "Rent", amount: 2100, notes: "Monthly rent" },
      { category: "Transport", amount: 240, notes: "Ride shares" },
      { category: "Subscriptions", amount: 95, notes: "Software tools" },
    ],
  },
  {
    month: "2025-09",
    income: 8750,
    expenses: [
      { category: "Rent", amount: 2100, notes: "Monthly rent" },
      { category: "Groceries", amount: 710, notes: "Weekly groceries" },
      { category: "Entertainment", amount: 290, notes: "Concert night" },
    ],
  },
  {
    month: "2025-10",
    income: 8950,
    expenses: [
      { category: "Rent", amount: 2100, notes: "Monthly rent" },
      { category: "Utilities", amount: 275, notes: "Seasonal utilities" },
      { category: "Shopping", amount: 430, notes: "Work wardrobe" },
    ],
  },
  {
    month: "2025-11",
    income: 9100,
    expenses: [
      { category: "Rent", amount: 2100, notes: "Monthly rent" },
      { category: "Groceries", amount: 730, notes: "Holiday prep" },
      { category: "Transport", amount: 210, notes: "Commute" },
    ],
  },
  {
    month: "2025-12",
    income: 9800,
    expenses: [
      { category: "Rent", amount: 2100, notes: "Monthly rent" },
      { category: "Entertainment", amount: 520, notes: "Year-end events" },
      { category: "Gifts", amount: 760, notes: "Holiday gifting" },
    ],
  },
  {
    month: "2026-01",
    income: 9300,
    expenses: [
      { category: "Rent", amount: 2100, notes: "Monthly rent" },
      { category: "Healthcare", amount: 220, notes: "Checkup and meds" },
      { category: "Subscriptions", amount: 120, notes: "Annual renewals" },
    ],
  },
  {
    month: "2026-02",
    income: 9500,
    expenses: [
      { category: "Rent", amount: 2100, notes: "Monthly rent" },
      { category: "Groceries", amount: 690, notes: "Household staples" },
      { category: "Transport", amount: 200, notes: "Fuel and transit" },
    ],
  },
  {
    month: "2026-03",
    income: 9700,
    expenses: [
      { category: "Rent", amount: 2100, notes: "Monthly rent" },
      { category: "Utilities", amount: 300, notes: "Power and internet" },
      { category: "Shopping", amount: 520, notes: "Home supplies" },
    ],
  },
  {
    month: "2026-04",
    income: 9900,
    expenses: [
      { category: "Rent", amount: 2100, notes: "Monthly rent" },
      { category: "Groceries", amount: 740, notes: "Weekly grocery run" },
      { category: "Entertainment", amount: 360, notes: "Weekend plans" },
    ],
  },
];

const toDateString = (month: string, day: string): string => `${month}-${day}`;

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

export function buildDemoRecords(): FinancialRecord[] {
  const records: FinancialRecord[] = [];

  DEMO_MONTHS.forEach((entry, monthIndex) => {
    records.push({
      id: `demo-income-${monthIndex + 1}`,
      userId: "demo-user",
      amount: entry.income,
      type: "INCOME",
      category: monthIndex % 2 === 0 ? "Salary" : "Freelance",
      date: toDateString(entry.month, "02"),
      notes: monthIndex % 2 === 0 ? "Monthly payroll deposit" : "Client invoice paid",
      createdAt: `${toDateString(entry.month, "02")}T09:00:00.000Z`,
      updatedAt: `${toDateString(entry.month, "02")}T09:00:00.000Z`,
      isDeleted: false,
    });

    entry.expenses.forEach((expense, expenseIndex) => {
      records.push({
        id: `demo-expense-${monthIndex + 1}-${expenseIndex + 1}`,
        userId: "demo-user",
        amount: expense.amount,
        type: "EXPENSE",
        category: expense.category,
        date: toDateString(entry.month, String(10 + expenseIndex).padStart(2, "0")),
        notes: expense.notes,
        createdAt: `${toDateString(entry.month, String(10 + expenseIndex).padStart(2, "0"))}T12:00:00.000Z`,
        updatedAt: `${toDateString(entry.month, String(10 + expenseIndex).padStart(2, "0"))}T12:00:00.000Z`,
        isDeleted: false,
      });
    });
  });

  return records.sort((left, right) => right.date.localeCompare(left.date));
}

export const DEMO_RECORDS = buildDemoRecords();

function getLastTwelveMonths(): string[] {
  const months = DEMO_MONTHS.map((entry) => entry.month);
  return months.slice(-12);
}

export function buildDemoDashboardData(records: FinancialRecord[] = DEMO_RECORDS): {
  summary: DashboardSummary;
  byCategory: CategoryBreakdownItem[];
  monthly: MonthlyBreakdownItem[];
} {
  const summary = records.reduce<DashboardSummary>(
    (accumulator, record) => {
      if (record.type === "INCOME") {
        accumulator.totalIncome += record.amount;
      } else {
        accumulator.totalExpenses += record.amount;
      }

      accumulator.netBalance = accumulator.totalIncome - accumulator.totalExpenses;
      return accumulator;
    },
    { totalIncome: 0, totalExpenses: 0, netBalance: 0 }
  );

  const byCategoryMap = new Map<string, CategoryBreakdownItem>();
  for (const record of records) {
    if (record.type !== "EXPENSE") continue;

    const entry = byCategoryMap.get(record.category) ?? {
      category: record.category,
      income: 0,
      expense: 0,
      total: 0,
    };

    entry.expense += record.amount;
    entry.total += record.amount;
    byCategoryMap.set(record.category, entry);
  }

  const monthlyMap = new Map<string, MonthlyBreakdownItem>();
  for (const month of getLastTwelveMonths()) {
    monthlyMap.set(month, { month, income: 0, expense: 0, total: 0 });
  }

  for (const record of records) {
    const month = record.date.slice(0, 7);
    const entry = monthlyMap.get(month);

    if (!entry) continue;

    if (record.type === "INCOME") {
      entry.income += record.amount;
    } else {
      entry.expense += record.amount;
    }

    entry.total += record.amount;
  }

  return {
    summary,
    byCategory: [...byCategoryMap.values()].sort((left, right) => right.total - left.total),
    monthly: [...monthlyMap.values()],
  };
}
