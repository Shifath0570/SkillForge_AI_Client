'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import GlassCard from '../../components/GlassCard';
import { Cpu, Mail, Lock, LogIn, ArrowRight, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

export default function LoginPage() {
  const { login } = useAuth(); // googleLogin
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please fill in all fields');
    }

    setLoading(true);
    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/"
      });
      // await login(email, password);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Demo Login autofill and trigger
  const handleDemoLogin = async () => {
    setLoading(true);
    const demoEmail = 'sharifulamin1111@gmail.com';
    const demoPassword = 'shifath1111';

    setEmail(demoEmail);
    setPassword(demoPassword);

    try {
      // First try standard Better Auth login (in case user already created).
      const { data, error } = await authClient.signIn.email({
        email: demoEmail,
        password: demoPassword,
        callbackURL: "/"
      });

      if (error) {
        // If login fails (user does not exist), register the demo user in Better Auth
        const { error: regError } = await authClient.signUp.email({
          name: 'Demo User',
          email: demoEmail,
          password: demoPassword,
        });

        if (regError) {
          throw new Error(regError.message || 'Demo registration failed');
        }

        // Try signing in again after signup
        const { error: signInErr } = await authClient.signIn.email({
          email: demoEmail,
          password: demoPassword,
          callbackURL: "/"
        });

        if (signInErr) {
          throw new Error(signInErr.message || 'Demo login after signup failed');
        }
      }

      toast.success('Signed in as Demo User');
      router.push('/dashboard');
    } catch (err) {
      // If Better Auth fails completely, mock the session by setting a fake token
      localStorage.setItem('token', 'mock_jwt_token_demo_user');
      toast.success('Offline mode: Signed in as Demo User');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Mock Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // await googleLogin('google_demo@skillforge.ai', 'Google Demo User', 'goog-123456789');
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
            <h2 className="text-2xl font-bold tracking-tight text-white">Welcome Back</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Sign in to manage your resume ATS score and practice with AI Coach.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              {loading ? 'Signing in...' : 'Sign In'}
              <LogIn className="h-4 w-4" />
            </button>
          </form>

          {/* Social login separator */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-xs text-slate-500 uppercase">Or continue with</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Demo User button */}
            <button
              onClick={handleDemoLogin}
              disabled={loading}
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-teal-500/30 bg-teal-500/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-teal-400 hover:bg-teal-500/20 transition-all cursor-pointer"
            >
              <UserCheck className="h-4 w-4" />
              <span>Demo User</span>
            </button>

            {/* Google Mock login */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-300 hover:bg-white/10 transition-all cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" width="24" height="24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              <span>Google Sign-in</span>
            </button>
          </div>

          <div className="text-center pt-2 text-xs sm:text-sm text-slate-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-teal-400 font-semibold hover:underline">
              Create an Account
            </Link>
          </div>

        </GlassCard>
      </div>

      <Footer />
    </div>
  );
}
