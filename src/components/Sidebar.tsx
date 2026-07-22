'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, Bot, Briefcase, BarChart3, Settings, LogOut, Cpu } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Resumes', href: '/dashboard/resume', icon: FileText },
    { name: 'AI Services', href: '/dashboard/ai-generator', icon: Bot },
    { name: 'AI Coach Chat', href: '/dashboard/ai-coach', icon: Bot },
    { name: 'Job Applications', href: '/dashboard/applications', icon: Briefcase },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Profile Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname?.startsWith(href);
  };

  return (
    <aside className="w-64 border-r border-white/10 bg-slate-950/40 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 backdrop-blur-sm">
      
      {/* Menu items */}
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Navigation
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <Icon className={`h-4.5 w-4.5 ${active ? 'text-blue-400' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* User profile details & logout */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center space-x-3 px-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-teal-400 flex items-center justify-center text-slate-900 font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold truncate text-white">{user?.name || 'User'}</h4>
            <p className="text-xs text-slate-500 truncate">{user?.email || 'demo@skillforge.ai'}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex w-full items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
        >
          <LogOut className="h-4.5 w-4.5" />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
}
