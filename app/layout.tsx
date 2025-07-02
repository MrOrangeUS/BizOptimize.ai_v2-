"use client";

import '@/styles/globals.css';
import NextAuthSessionProvider from '@/components/SessionProvider';
import dynamic from 'next/dynamic';

// Dynamically import AlienCursor to prevent SSR issues
const AlienCursor = dynamic(() => import('@/components/AlienCursor'), {
  ssr: false,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NextAuthSessionProvider>
          <AlienCursor />
          {children}
        </NextAuthSessionProvider>
      </body>
    </html>
  );
} 