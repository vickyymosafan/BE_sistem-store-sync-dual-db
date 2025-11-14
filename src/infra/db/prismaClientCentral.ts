import { PrismaClient } from '@prisma/client';

let prismaCentral: PrismaClient | null = null;

export function getPrismaCentral(): PrismaClient {
  if (!prismaCentral) {
    prismaCentral = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL_CENTRAL,
        },
      },
    });
  }
  return prismaCentral;
}
