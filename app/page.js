"use client";
export const dynamic = "force-dynamic";
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'authenticated') {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [status, router]);
  return null;
} 