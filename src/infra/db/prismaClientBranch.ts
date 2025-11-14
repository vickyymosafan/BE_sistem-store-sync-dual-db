import { PrismaClient } from '@prisma/client';

let prismaBranch: PrismaClient | null = null;

export function getPrismaBranch(): PrismaClient {
  if (!prismaBranch) {
    prismaBranch = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL_BRANCH_BONDOWOSO,
        },
      },
    });
  }
  return prismaBranch;
}
