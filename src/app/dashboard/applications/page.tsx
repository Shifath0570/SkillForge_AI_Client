'use client';

import React, { useEffect, useState } from 'react';
import GlassCard from '../../../components/GlassCard';
import Skeleton from '../../../components/Skeleton';
import { api } from '../../../utils/api';
import toast from 'react-hot-toast';
import { 
  Briefcase, Plus, Trash2, Calendar, Eye, 
  ChevronRight, Filter, Search, Edit3, X, Save
} from 'lucide-react';

export default function ApplicationsTrackerPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState<any[]>([]);

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState('Applied');
  const [resumeId, setResumeId] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Search & Filter
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const loadData = async () => {
    try {
      const appRes = await api.applications.getAll();
      if (appRes.success) {
        setApplications(appRes.applications || []);
      }
      const resRes = await api.resumes.getAll();
      if (resRes.success) {
        setResumes(resRes.resumes || []);
      }
    } catch (err) {
      console.error('Error fetching tracker details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !company) return toast.error('Please provide position title and company name');

    setSubmitting(true);
    try {
      const res = await api.applications.create({
        jobTitle,
        company,
        status,
        resumeId: resumeId || null,
        notes
      });
      if (res.success && res.application) {
        toast.success('Job application saved');
        setApplications([res.application, ...applications]);
        
        // reset form
        setJobTitle('');
        setCompany('');
        setStatus('Applied');
        setResumeId('');
        setNotes('');
        setShowAddForm(false);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string) => {
    try {
      const res = await api.applications.update(id, {
        status: editStatus,
        notes: editNotes
      });
      if (res.success && res.application) {
        toast.success('Application updated successfully');
        setApplications(applications.map(app => app._id === id ? { ...app, status: editStatus, notes: editNotes } : app));
        setEditingId(null);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update details');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job application record?')) return;
    try {
      const res = await api.applications.delete(id);
      if (res.success) {
        toast.success('Record deleted');
        setApplications(applications.filter(app => app._id !== id));
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete record');
    }
  };

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

  // Filter application rows
  const filteredApps = applications.filter(app => {
    const matchSearch = app.jobTitle.toLowerCase().includes(search.toLowerCase()) || 
                        app.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-1.5">
            <Briefcase className="h-6 w-6 text-teal-400" />
            <span>Job Applications Tracker</span>
          </h1>
          <p className="text-sm text-slate-400">
            Log positions, structure interview schedules, and link active resume audits.
          </p>
        </div>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-md transition-all cursor-pointer"
        >
          {showAddForm ? <X className="h-4.5 w-4.5" /> : <Plus className="h-4.5 w-4.5" />}
          <span>{showAddForm ? 'Cancel Form' : 'Log New Application'}</span>
        </button>
      </div>

      {/* Slide-down Log Application Form */}
      {showAddForm && (
        <form onSubmit={handleCreateApplication}>
          <GlassCard className="border border-teal-500/20 space-y-4 max-w-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Log Application Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Position Title */}
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Position Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Lead Developer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-900 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              {/* Company */}
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Company Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Microsoft"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-900 text-xs text-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Status */}
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Application Stage</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-900 text-xs text-white focus:outline-none"
                >
                  <option value="Applied">Applied</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Offered">Offered</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Linked Resume */}
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Linked Resume Audit</label>
                <select
                  value={resumeId}
                  onChange={(e) => setResumeId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-900 text-xs text-white focus:outline-none"
                >
                  <option value="">None linked</option>
                  {resumes.map(r => (
                    <option key={r._id} value={r._id}>{r.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Interviews Notes / Target Milestones</label>
              <textarea
                placeholder="Mention salary ranges, recruiter names, or interview deadlines..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-900 text-xs text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-teal-600 hover:bg-teal-700 py-2.5 rounded-xl font-semibold text-xs text-white disabled:opacity-50 transition-all cursor-pointer"
            >
              {submitting ? 'Saving record...' : 'Save Job Record'}
            </button>
          </GlassCard>
        </form>
      )}

      {/* Search, Filter controls */}
      <GlassCard className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between border border-white/5 bg-slate-950/20">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search position or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-white/10 bg-slate-900 text-xs text-white focus:outline-none"
          />
        </div>

        {/* Filter select */}
        <div className="flex items-center gap-1.5">
          <Filter className="h-4 w-4 text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-white/10 bg-slate-900 text-xs text-slate-300 focus:outline-none"
          >
            <option value="All">All Stages</option>
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offered">Offered</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

      </GlassCard>

      {/* Applications list Grid */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => <Skeleton key={i} variant="rect" className="h-28" />)}
        </div>
      ) : filteredApps.length > 0 ? (
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <GlassCard key={app._id} className="border border-white/5 hover:border-slate-800 transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              
              {/* Application Details */}
              <div className="space-y-2 flex-grow">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-white text-base">{app.jobTitle}</h3>
                  <span className="text-slate-500">at</span>
                  <span className="font-semibold text-slate-300 text-sm">{app.company}</span>
                </div>
                
                <div className="flex gap-4 flex-wrap text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Applied: {new Date(app.dateApplied).toLocaleDateString()}</span>
                  </span>
                  {app.resume && (
                    <span className="text-blue-400">
                      Linked Resume: {app.resume.title} ({app.resume.atsScore}%)
                    </span>
                  )}
                </div>

                {editingId === app._id ? (
                  <div className="pt-2 space-y-2 max-w-md">
                    <textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-1.5 rounded-xl border border-white/10 bg-slate-900 text-xs text-white focus:outline-none"
                      placeholder="Modify interviews notes..."
                    />
                  </div>
                ) : (
                  app.notes && (
                    <p className="text-xs text-slate-400 border-l-2 border-white/10 pl-2 italic">
                      Notes: {app.notes}
                    </p>
                  )
                )}

              </div>

              {/* Status and Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5">
                
                {/* Editing Status vs Display Status */}
                {editingId === app._id ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="px-2 py-1 rounded-lg border border-white/10 bg-slate-900 text-xs text-white focus:outline-none"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Interviewing">Interviewing</option>
                      <option value="Offered">Offered</option>
                      <option value="Rejected">Rejected</option>
                    </select>

                    <button
                      onClick={() => handleUpdateStatus(app._id)}
                      className="p-1.5 rounded-lg bg-emerald-600/25 border border-emerald-500/20 text-emerald-400 cursor-pointer"
                      title="Save updates"
                    >
                      <Save className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 rounded-lg bg-slate-800 border border-white/10 text-slate-400 cursor-pointer"
                      title="Cancel"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>

                    <button
                      onClick={() => {
                        setEditingId(app._id);
                        setEditStatus(app.status);
                        setEditNotes(app.notes || '');
                      }}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white cursor-pointer"
                      title="Edit Application Stage"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}

                <button
                  onClick={() => handleDelete(app._id)}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400 border border-red-500/20 hover:text-white cursor-pointer"
                  title="Remove record"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>

              </div>

            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center space-y-4 max-w-md mx-auto border border-dashed border-white/10 rounded-2xl p-6">
          <Briefcase className="h-12 w-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No jobs logged</h3>
          <p className="text-xs text-slate-500">
            You are not tracking any active job hunting applications right now. Log your first role details above.
          </p>
        </div>
      )}

    </div>
  );
}
