'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import GlassCard from '../../components/GlassCard';
import { Cpu, Mail, Lock, User, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

export default function RegisterPage() {
  // const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter()

  console.log(name, email, password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return toast.error('Please fill in all fields');
    }

    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters long');
    }

    setLoading(true);
    try {
      const { data, error } = await authClient.signUp.email({
              name,
              email,
              password,
            });
      
            console.log(data);
     if (error) {
      toast.error(error.message || 'Failed to register');
      return;
    }

    toast.success('Account created successfully!');
    router.push('/login'); // Redirect user after successful signup
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#020617] relative">
      <Navbar />

      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <GlassCard className="w-full max-w-md border border-white/5 space-y-6">
          
          <div className="text-center space-y-2">
            <Cpu className="h-10 w-10 text-teal-400 mx-auto animate-pulse" />
            <h2 className="text-2xl font-bold tracking-tight text-white">Create Account</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Get full access to ATS resume analytics and AI interview prep.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/50 text-sm text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/50 text-sm text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/50 text-sm text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? 'Registering...' : 'Register'}
              <UserPlus className="h-4 w-4" />
            </button>
          </form>

          <div className="text-center pt-2 text-xs sm:text-sm text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-teal-400 font-semibold hover:underline">
              Sign In
            </Link>
          </div>

        </GlassCard>
      </div>

      <Footer />
    </div>
  );
}
