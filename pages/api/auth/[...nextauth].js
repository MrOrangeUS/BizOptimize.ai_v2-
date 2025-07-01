import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../lib/prisma';

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    // Phone login is not natively supported by NextAuth.
    // To add phone login, use a custom provider or integrate with Firebase/Auth0.
    // See: https://next-auth.js.org/providers/overview#creating-a-custom-provider
  ],
  secret: process.env.NEXTAUTH_SECRET,
});

// Required ENV VARS:
// GITHUB_ID, GITHUB_SECRET
// GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
// EMAIL_SERVER, EMAIL_FROM
// NEXTAUTH_SECRET
