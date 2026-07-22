'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import Skeleton from '../../components/Skeleton';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-[#020617]">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-8">
          <div className="w-full max-w-4xl space-y-4">
            <Skeleton variant="circle" />
            <Skeleton variant="text" className="w-2/3" />
            <Skeleton variant="rect" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // The AuthContext handles redirecting
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#020617]">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
        <main className="flex-grow p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
