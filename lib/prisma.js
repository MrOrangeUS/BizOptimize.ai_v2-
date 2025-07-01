import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;

// Create Prisma client with standard MongoDB connection
const createPrismaClient = () => {
  // During build time, environment variables might not be available
  if (typeof window !== 'undefined') {
    return new PrismaClient();
  }

  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.warn('DATABASE_URL not available during initialization, will validate at runtime');
    return new PrismaClient();
  }
  
  // Validate the connection string format
  if (!databaseUrl.startsWith('mongodb://') && !databaseUrl.startsWith('mongodb+srv://')) {
    throw new Error('DATABASE_URL must start with mongodb:// or mongodb+srv://');
  }
  
  console.log('Initializing Prisma client with MongoDB connection');
  
  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
