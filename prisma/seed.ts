import type { Role, RecordType } from '../src/types/domain';
import { prisma } from '../src/config/prisma';
import { hashPassword } from '../src/lib/password';

const seed = async (): Promise<void> => {
  await prisma.financialRecord.deleteMany();
  await prisma.user.deleteMany();

  const password = await hashPassword('Password123!');

  const [admin, analyst, viewer] = await prisma.$transaction([
    prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@vaultex.local',
        password,
        role: 'ADMIN'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Analyst User',
        email: 'analyst@vaultex.local',
        password,
        role: 'ANALYST'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Viewer User',
        email: 'viewer@vaultex.local',
        password,
        role: 'VIEWER'
      }
    })
  ]);

  const recordOwners = [admin, analyst, viewer];
  const categories = ['Salary', 'Rent', 'Groceries', 'Transportation', 'Utilities', 'Bonus'];
  const records: Array<{
    userId: string;
    amount: number;
    type: RecordType;
    category: string;
    date: Date;
    notes: string;
    isDeleted: boolean;
  }> = [];

  for (let index = 0; index < 20; index += 1) {
    const owner = recordOwners[index % recordOwners.length];
    const isIncome = index % 2 === 0;
    const month = String((index % 12) + 1).padStart(2, '0');
    const day = String((index % 27) + 1).padStart(2, '0');

    records.push({
      userId: owner.id,
      amount: isIncome ? 1500 + index * 100 : 50 + index * 25,
      type: isIncome ? 'INCOME' : 'EXPENSE',
      category: categories[index % categories.length],
      date: new Date(`2024-${month}-${day}T00:00:00.000Z`),
      notes: `Seeded record ${index + 1}`,
      isDeleted: false
    });
  }

  await prisma.financialRecord.createMany({ data: records });
};

void seed()
  .catch((error: unknown) => {
    console.error('Seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
