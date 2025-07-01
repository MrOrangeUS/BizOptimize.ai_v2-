import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;

// Create Prisma client with proper MongoDB X.509 certificate handling
const createPrismaClient = () => {
  // During build time, environment variables might not be available
  // So we'll create a basic client and validate at runtime
  if (typeof window !== 'undefined') {
    // Client-side, return a mock client
    return new PrismaClient();
  }

  let databaseUrl = process.env.DATABASE_URL;
  
  // If DATABASE_URL is not available (e.g., during build), use a placeholder
  if (!databaseUrl) {
    console.warn('DATABASE_URL not available during initialization, will validate at runtime');
    databaseUrl = 'mongodb+srv://placeholder:placeholder@placeholder.mongodb.net/placeholder';
  }
  
  // If we have a certificate and the URL doesn't already include X.509 auth
  if (process.env.MONGO_CERT_B64 && !databaseUrl.includes('authMechanism=MONGODB-X509')) {
    // Decode the certificate
    const cert = Buffer.from(process.env.MONGO_CERT_B64, 'base64').toString('utf-8');
    
    // Ensure the base URL is properly formatted
    const baseUrl = databaseUrl.split('?')[0];
    const separator = databaseUrl.includes('?') ? '&' : '?';
    
    // Construct the connection string with X.509 authentication
    databaseUrl = `${baseUrl}${separator}tls=true&tlsCertificateKeyFileContent=${encodeURIComponent(cert)}&authSource=$external&authMechanism=MONGODB-X509`;
    
    console.log('Using MongoDB X.509 certificate authentication');
  } else {
    console.log('Using standard MongoDB connection');
  }
  
  // Validate the connection string format only if it's not a placeholder
  if (!databaseUrl.includes('placeholder') && !databaseUrl.startsWith('mongodb://') && !databaseUrl.startsWith('mongodb+srv://')) {
    throw new Error('DATABASE_URL must start with mongodb:// or mongodb+srv://');
  }
  
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
