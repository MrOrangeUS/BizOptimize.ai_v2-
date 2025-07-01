import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;

// Create Prisma client with custom connection string for Vercel
const createPrismaClient = () => {
  // If we have a certificate, create a custom connection string
  if (process.env.MONGO_CERT_B64) {
    const cert = Buffer.from(process.env.MONGO_CERT_B64, 'base64').toString('utf-8');
    const baseUrl = process.env.DATABASE_URL?.split('?')[0] || process.env.DATABASE_URL;
    const customUrl = `${baseUrl}?tls=true&tlsCertificateKeyFileContent=${encodeURIComponent(cert)}`;
    
    return new PrismaClient({
      datasources: {
        db: {
          url: customUrl,
        },
      },
    });
  }
  
  // Fallback to regular connection
  return new PrismaClient();
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
