'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import { useAuth } from '../context/AuthContext';
import { Menu, X, Cpu, LogOut, LayoutDashboard, FileText, Bot, BarChart3, Briefcase, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut, useSession } from '@/lib/auth-client';

export default function Navbar() {
  // const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const { data: session, isPending } = useSession()
  const user = session?.user;


  const handleSignOut = async () => {
    await signOut()
  }

  const guestLinks = [
    { name: 'Home', href: '/' },
    { name: 'Explore Templates', href: '/templates' },
    { name: 'Blog', href: '#blog' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const authLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Resumes', href: '/dashboard/resume/add', icon: FileText },
    { name: 'AI Coach', href: '/dashboard/ai-coach', icon: Bot },
    { name: 'Applications', href: '/dashboard/applications', icon: Briefcase },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Profile', href: '/dashboard/settings', icon: UserIcon },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold tracking-tight text-white">
            <Cpu className="h-6 w-6 text-teal-400 animate-pulse" />
            <span>
              SkillForge <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">AI</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-6">
            {isPending ? (
              <div className="h-8 w-24 bg-white/5 animate-pulse rounded-lg" />
            ) : !user ? (
              <>
                {guestLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-teal-400 ${isActive(link.href) ? 'text-teal-400' : 'text-slate-300'
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  href="/login"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-blue-500/25"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                {authLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`flex items-center space-x-1.5 text-sm font-medium transition-colors hover:text-teal-400 ${isActive(link.href) ? 'text-teal-400 font-semibold' : 'text-slate-300'
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
                <div className="flex items-center space-x-2 border-l border-white/10 pl-4">
                  <span className="text-xs font-medium text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded-full max-w-[120px] truncate">
                    {user.name || user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-white/5 hover:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/10 bg-slate-950/95"
          >
            <div className="space-y-1 px-2 pb-3 pt-2">
              {isPending ? (
                <div className="h-10 w-full bg-white/5 animate-pulse rounded-md" />
              ) : !user ? (
                <>
                  {guestLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block rounded-md px-3 py-2 text-base font-medium ${isActive(link.href) ? 'bg-white/10 text-teal-400' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center mt-2 rounded-md bg-blue-600 px-4 py-2.5 text-base font-medium text-white hover:bg-blue-700"
                  >
                    Login
                  </Link>
                </>
              ) : (
                <>
                  <div className="px-3 py-2 text-xs font-semibold text-teal-400 bg-teal-500/10 rounded-md border border-teal-500/20 mb-2">
                    Signed in as {user.name || user.email}
                  </div>
                  {authLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-2 rounded-md px-3 py-2 text-base font-medium ${isActive(link.href) ? 'bg-white/10 text-teal-400' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                          }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{link.name}</span>
                      </Link>
                    );
                  })}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleSignOut();
                    }}
                    className="flex w-full items-center space-x-2 rounded-md px-3 py-2 text-base font-medium text-red-400 hover:bg-red-500/10 cursor-pointer"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
