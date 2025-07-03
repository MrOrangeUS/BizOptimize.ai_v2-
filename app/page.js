"use client";
export const dynamic = "force-dynamic";
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import ThemedBox from '/components/ThemedBox'; // Use absolute path

export default function Home() {
  return <ThemedBox />;
} 