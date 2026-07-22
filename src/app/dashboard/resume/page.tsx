'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import GlassCard from '../../../components/GlassCard';
import Skeleton from '../../../components/Skeleton';
import { api } from '../../../utils/api';
import toast from 'react-hot-toast';
import { 
  FileText, Plus, Trash2, Award, Calendar, Search, 
  ChevronRight, ArrowUpDown, Filter, Eye 
} from 'lucide-react';

export default function ResumeListPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');

  const fetchResumes = async () => {
    try {
      const res = await api.resumes.getAll();
      if (res.success) {
        setResumes(res.resumes || []);
      }
    } catch (err) {
      console.error('Error fetching resumes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm('Are you sure you want to delete this resume? All associated ATS audit records will be removed.')) {
      return;
    }
    
    try {
      const res = await api.resumes.delete(id);
      if (res.success) {
        toast.success('Resume deleted successfully');
        setResumes(resumes.filter(r => r._id !== id));
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete resume');
    }
  };

  const getAtsBadgeColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 70) return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    if (score >= 50) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  // Industry unique list
  const industries = ['All', ...new Set<string>(resumes.map(r => r.industry))];

  // Filters, search & sorting logic
  const processedResumes = resumes
    .filter(resume => {
      const matchSearch = resume.title.toLowerCase().includes(search.toLowerCase()) || 
                          resume.industry.toLowerCase().includes(search.toLowerCase());
      const matchIndustry = industryFilter === 'All' || resume.industry === industryFilter;
      return matchSearch && matchIndustry;
    })
    .sort((a, b) => {
      if (sortBy === 'score') {
        return (b.atsScore || 0) - (a.atsScore || 0);
      }
      // sort by date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">My Resumes</h1>
          <p className="text-sm text-slate-400">
            View, upload and audit your resumes using our AI scoring agent.
          </p>
        </div>
        <Link
          href="/dashboard/resume/add"
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-md transition-all cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Upload Resume (PDF)</span>
        </Link>
      </div>

      {/* Search, Filter, Sort Controls */}
      <GlassCard className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between border border-white/5 bg-slate-950/20">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search resumes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-white/10 bg-slate-900/50 text-xs text-white focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          
          <div className="flex items-center gap-1">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-slate-900 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              {industries.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'score')}
              className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-slate-900 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="date">Sort by Date</option>
              <option value="score">Sort by ATS Score</option>
            </select>
          </div>

        </div>

      </GlassCard>

      {/* Resume Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <Skeleton key={i} variant="rect" className="h-44" />)}
        </div>
      ) : processedResumes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {processedResumes.map((resume) => (
            <GlassCard key={resume._id} hoverGlow className="flex flex-col justify-between border-t-2 border-t-slate-700/50 hover:border-t-blue-500/50">
              
              <div className="space-y-3">
                
                {/* Title and Industry */}
                <div className="flex justify-between items-start gap-2">
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-white text-base truncate">{resume.title}</h3>
                    <span className="text-xs text-slate-500 font-semibold">{resume.industry}</span>
                  </div>
                  <div className={`flex items-center gap-1 border rounded-lg px-2 py-0.5 text-xs font-bold ${getAtsBadgeColor(resume.atsScore || 0)}`}>
                    <Award className="h-3.5 w-3.5" />
                    <span>{resume.atsScore || 0}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-slate-400">
                    <span className="font-semibold">Level:</span> {resume.experienceLevel}
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {resume.tags?.slice(0, 4).map((tag: string) => (
                      <span key={tag} className="text-[10px] bg-slate-800 text-slate-300 border border-white/5 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    )) || (
                      <span className="text-xs text-slate-600">No tags detected.</span>
                    )}
                  </div>
                </div>

              </div>

              {/* Action Buttons Footer */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                
                <div className="flex items-center text-xs text-slate-500 gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{new Date(resume.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center space-x-2">
                  
                  {/* View Details */}
                  <Link
                    href={`/dashboard/ai-generator?resumeId=${resume._id}`}
                    className="p-2 rounded-lg bg-blue-600/10 hover:bg-blue-600/25 text-blue-400 border border-blue-500/20 hover:text-white transition-all"
                    title="View ATS Audit details"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Link>

                  {/* Delete */}
                  <button
                    onClick={(e) => handleDelete(resume._id, e)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400 border border-red-500/20 hover:text-white transition-all cursor-pointer"
                    title="Delete Resume"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                </div>

              </div>

            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center space-y-4 max-w-md mx-auto border border-dashed border-white/10 rounded-2xl p-6">
          <FileText className="h-12 w-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No resumes uploaded</h3>
          <p className="text-xs text-slate-500">
            Search or filter criteria yielded no matches, or you haven&apos;t uploaded a PDF yet. Start auditing your resume today.
          </p>
          <Link
            href="/dashboard/resume/add"
            className="inline-block rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition-all"
          >
            Upload First Resume
          </Link>
        </div>
      )}

    </div>
  );
}
