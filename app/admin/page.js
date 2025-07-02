"use client";
import AlienImageUploader from '../../components/AlienImageUploader';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (session && session.user && session.user.role === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [session]);

  if (status === 'loading') {
    return <div className="text-white p-8">Loading...</div>;
  }
  if (!session) {
    return <div className="min-h-screen flex items-center justify-center text-2xl text-red-400">Access denied: Login required</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-alien-black flex flex-col items-center justify-start py-12 px-4">
      <h1 className="text-4xl font-bold text-alien-green mb-8">Admin Tools</h1>
      <AlienImageUploader />
      <div className="mt-12 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-alien-green mb-4">User Management</h2>
        <div className="bg-white/10 rounded-lg p-4 border border-white/20 text-white/80 mb-8">(Coming soon: View, promote, or deactivate users)</div>
        <h2 className="text-2xl font-semibold text-alien-green mb-4">Avatar Gallery</h2>
        <div className="bg-white/10 rounded-lg p-4 border border-white/20 text-white/80 mb-8">(Coming soon: Manage uploaded avatars, set default, delete expired images)</div>
        <h2 className="text-2xl font-semibold text-alien-green mb-4">System Settings</h2>
        <div className="bg-white/10 rounded-lg p-4 border border-white/20 text-white/80">(Coming soon: Configure environment, API keys, and more)</div>
      </div>
    </div>
  );
} 