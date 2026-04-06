import type { RecordType } from '../src/types/domain';
import { prisma } from '../src/config/prisma';
import { hashPassword } from '../src/lib/password';

const CATEGORIES = [
  'Salary',
  'Freelance',
  'Rent',
  'Groceries',
  'Utilities',
  'Transport',
  'Entertainment',
  'Healthcare'
] as const;

const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomDateWithinLast12Months = (): Date => {
  const now = new Date();
  const start = new Date(now);
  start.setMonth(start.getMonth() - 12);

  const timestamp = randomInt(start.getTime(), now.getTime());
  return new Date(timestamp);
};

const seed = async (): Promise<void> => {
  await prisma.financialRecord.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await hashPassword('Admin@123');
  const analystPassword = await hashPassword('Analyst@123');
  const viewerPassword = await hashPassword('Viewer@123');

  const [admin, analyst, viewer] = await prisma.$transaction([
    prisma.user.create({
      data: {
        name: 'Vaultex Admin',
        email: 'admin@vaultex.dev',
        password: adminPassword,
        role: 'ADMIN'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Vaultex Analyst',
        email: 'analyst@vaultex.dev',
        password: analystPassword,
        role: 'ANALYST'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Vaultex Viewer',
        email: 'viewer@vaultex.dev',
        password: viewerPassword,
        role: 'VIEWER'
      }
    })
  ]);

  const owners = [admin, analyst, viewer];
  const records: Array<{
    userId: string;
    amount: number;
    type: RecordType;
    category: string;
    date: Date;
    notes: string;
    isDeleted: boolean;
  }> = [];

  for (let index = 0; index < 40; index += 1) {
    const type: RecordType = Math.random() > 0.45 ? 'INCOME' : 'EXPENSE';
    const amount =
      type === 'INCOME' ? randomInt(5000, 50000) : randomInt(500, 15000);

    records.push({
      userId: owners[index % owners.length].id,
      amount,
      type,
      category: CATEGORIES[index % CATEGORIES.length],
      date: randomDateWithinLast12Months(),
      notes: `Seed record ${index + 1}`,
      isDeleted: false
    });
  }

  await prisma.financialRecord.createMany({ data: records });

  const usersCount = await prisma.user.count();
  const recordsCount = await prisma.financialRecord.count();
  console.log(`Seed complete: ${usersCount} users, ${recordsCount} financial records`);
};

void seed()
  .catch((error: unknown) => {
    console.error('Seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
