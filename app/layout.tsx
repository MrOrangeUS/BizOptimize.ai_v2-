"use client";

import '@/styles/globals.css';
import NextAuthSessionProvider from '@/components/SessionProvider';
import React from 'react';
import dynamic from 'next/dynamic';
import AlienThemeProvider from '@/components/AlienThemeProvider';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

// Dynamically import AlienCursor to prevent SSR issues
const AlienCursor = dynamic(() => import('@/components/AlienCursor'), {
  ssr: false,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AlienThemeProvider>
          <NextAuthSessionProvider>
            <AlienCursor />
            {children}
          </NextAuthSessionProvider>
        </AlienThemeProvider>
      </body>
    </html>
  );
} 