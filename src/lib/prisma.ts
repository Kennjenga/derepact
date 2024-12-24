import { PrismaClient } from '@prisma/client';

// Create a new Prisma Client instance
export const prisma = new PrismaClient();

module.exports = prisma;