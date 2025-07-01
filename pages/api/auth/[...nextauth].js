import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../lib/prisma';

const missing = [];
if (!process.env.GITHUB_ID) missing.push('GITHUB_ID');
if (!process.env.GITHUB_SECRET) missing.push('GITHUB_SECRET');
if (!process.env.NEXTAUTH_SECRET) missing.push('NEXTAUTH_SECRET');
if (!process.env.DATABASE_URL) missing.push('DATABASE_URL');

if (missing.length > 0) {
  // eslint-disable-next-line no-console
  console.error('Missing required environment variables for NextAuth:', missing.join(', '));
}

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  // Optionally, add debug: true for more logging
  // debug: true,
});

// Required ENV VARS (set in Vercel or .env.local):
// GITHUB_ID, GITHUB_SECRET
// NEXTAUTH_SECRET
// DATABASE_URL
