import { prisma } from '../src/config/prisma';

export const resetDatabase = async (): Promise<void> => {
  await prisma.financialRecord.deleteMany();
  await prisma.user.deleteMany();
};
