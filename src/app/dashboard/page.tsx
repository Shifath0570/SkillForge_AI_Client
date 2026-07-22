'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import GlassCard from '../../components/GlassCard';
import Skeleton from '../../components/Skeleton';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { 
  FileText, Briefcase, Award, TrendingUp, Plus, ArrowRight, 
  MessageSquare, Settings as SettingsIcon, ShieldCheck
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

export default function DashboardOverview() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.dashboard.getStats();
        if (res.success) {
          setStats(res.stats);
          setRecentApps(res.recentApplications || []);
          setChartData(res.monthlyActivity || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Interviewing':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'Offered':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Rejected':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'Applied':
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="w-1/4 h-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} variant="rect" className="h-28" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton variant="rect" className="lg:col-span-2 h-72" />
          <Skeleton variant="rect" className="h-72" />
        </div>
      </div>
    );
  }

  // Fallbacks if stats fail or are empty
  const totalResumes = stats?.totalResumes || 0;
  const averageAts = stats?.averageAts || 0;
  const totalApplications = stats?.totalApplications || 0;
  const successRate = stats?.interviewSuccessRate || 0;

  return (
    <div className="space-y-6">
      
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Hello, {user?.name || 'User'}
          </h1>
          <p className="text-sm text-slate-400">
            Welcome to your career hub. Here is your progress analysis.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/resume/add"
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 shadow-md hover:shadow-blue-500/25 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Resume</span>
          </Link>
          <Link
            href="/dashboard/ai-coach"
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10 transition-all"
          >
            <MessageSquare className="h-4 w-4 text-teal-400" />
            <span>AI Career Coach</span>
          </Link>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Resumes */}
        <GlassCard hoverGlow className="flex items-center space-x-4 border-t-2 border-t-blue-500/30">
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold">Total Resumes</p>
            <h3 className="text-2xl font-extrabold text-white">{totalResumes}</h3>
          </div>
        </GlassCard>

        {/* ATS Score */}
        <GlassCard hoverGlow className="flex items-center space-x-4 border-t-2 border-t-teal-500/30">
          <div className="h-12 w-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold">Average ATS Score</p>
            <h3 className="text-2xl font-extrabold text-white">{averageAts}%</h3>
          </div>
        </GlassCard>

        {/* Applications */}
        <GlassCard hoverGlow className="flex items-center space-x-4 border-t-2 border-t-indigo-500/30">
          <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold">Job Applications</p>
            <h3 className="text-2xl font-extrabold text-white">{totalApplications}</h3>
          </div>
        </GlassCard>

        {/* Interview Rate */}
        <GlassCard hoverGlow className="flex items-center space-x-4 border-t-2 border-t-orange-500/30">
          <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold">Interview Rate</p>
            <h3 className="text-2xl font-extrabold text-white">{successRate}%</h3>
          </div>
        </GlassCard>

      </div>

      {/* Chart and Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Analytics Graph */}
        <GlassCard className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Monthly Activity Trend</h2>
            <span className="text-xs text-slate-500">6-Month progression</span>
          </div>
          <div className="h-64 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}
                    labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="applications" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorApps)" name="Applied Roles" />
                  <Area type="monotone" dataKey="interviews" stroke="#14B8A6" strokeWidth={2} fillOpacity={1} fill="url(#colorInts)" name="Interviews" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                No activity records found. Add applications to display visual trends.
              </div>
            )}
          </div>
        </GlassCard>

        {/* Quick Tips / AI Health check widget */}
        <GlassCard className="space-y-4 border border-blue-500/10">
          <h2 className="text-lg font-bold text-white flex items-center gap-1.5">
            <ShieldCheck className="h-5 w-5 text-teal-400" />
            <span>AI Auditing Status</span>
          </h2>
          <div className="space-y-4 text-sm text-slate-300">
            {totalResumes === 0 ? (
              <div className="space-y-3 py-4 text-center">
                <p className="text-slate-400 text-xs sm:text-sm">
                  You have not uploaded any resumes yet. Build your first ATS-friendly document now.
                </p>
                <Link
                  href="/dashboard/resume/add"
                  className="inline-block rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700 transition-all"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-xs text-teal-400 font-bold uppercase">ATS Audit Health</span>
                  <p className="text-white font-semibold mt-1">
                    {averageAts >= 85 ? 'Excellent Profile Standings!' : 'Improvements Suggested'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {averageAts >= 85 
                      ? 'Your resume scores highly on technical and format scans.' 
                      : 'Audit scans report keyword gaps. Head to AI Generator to fix them.'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-xs text-blue-400 font-bold uppercase">Next Milestones</span>
                  <ul className="text-xs space-y-1.5 mt-2 text-slate-300">
                    <li>• Optimize project metric quantification</li>
                    <li>• Practice React/Express mock coding interview</li>
                    <li>• Apply to 3 junior roles using cover letter builder</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </GlassCard>

      </div>

      {/* Recent Applications Table */}
      <GlassCard className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Recent Job Applications</h2>
          <Link 
            href="/dashboard/applications" 
            className="text-xs text-teal-400 hover:text-teal-300 hover:underline flex items-center gap-0.5"
          >
            <span>Manage All</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {recentApps.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-500">
                  <th className="py-2.5 font-semibold">Position</th>
                  <th className="py-2.5 font-semibold">Company</th>
                  <th className="py-2.5 font-semibold">Date Applied</th>
                  <th className="py-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {recentApps.map((app) => (
                  <tr key={app.id}>
                    <td className="py-3 font-semibold text-white">{app.jobTitle}</td>
                    <td className="py-3">{app.company}</td>
                    <td className="py-3 text-slate-400">
                      {new Date(app.dateApplied).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500 text-sm border border-dashed border-white/10 rounded-xl">
            No applications registered. Link roles to track interview updates.
          </div>
        )}
      </GlassCard>

    </div>
  );
}
