'use client';

import React, { useState, useEffect } from 'react';
import GlassCard from '../../../components/GlassCard';
import { useAuth } from '../../../context/AuthContext';
import { User, Settings, Save, ShieldAlert, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfileSettingsPage() {
  const { user, updateProfile, refreshUser } = useAuth();
  
  // Local form states
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Entry-Level');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [updating, setUpdating] = useState(false);

  // Sync user profile data on load
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setIndustry(user.profile?.industry || '');
      setExperienceLevel(user.profile?.experienceLevel || 'Entry-Level');
      setBio(user.profile?.bio || '');
      if (user.profile?.skills && user.profile.skills.length > 0) {
        setSkills(user.profile.skills.join(', '));
      }
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Please provide a name');

    setUpdating(true);
    const skillsArray = skills ? skills.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];
    
    try {
      await updateProfile({
        name,
        industry,
        experienceLevel,
        bio,
        skills: skillsArray
      });
      // refresh user state context
      await refreshUser();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Settings className="h-6 w-6 text-blue-500" />
        <h1 className="text-2xl font-bold text-white tracking-tight">Profile Settings</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <GlassCard className="space-y-6 border border-white/5">
          
          <div className="flex items-center space-x-3 pb-4 border-b border-white/5">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-blue-500 to-teal-400 flex items-center justify-center text-slate-900 font-extrabold text-lg">
              {name.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="font-bold text-white text-base">{name || 'User'}</h3>
              <p className="text-xs text-slate-500">{user?.email || 'demo@skillforge.ai'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900/50 text-white focus:outline-none"
                required
              />
            </div>

            {/* Target Industry */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Target Industry</label>
              <input
                type="text"
                placeholder="e.g. Software Development"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900/50 text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            {/* Experience Level */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Target Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900/50 text-white focus:outline-none"
              >
                <option value="Internship">Internship</option>
                <option value="Entry-Level">Entry-Level</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior-Level">Senior-Level</option>
                <option value="Lead / Executive">Lead / Executive</option>
              </select>
            </div>

            {/* Skills keywords list */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">My Skills (Comma separated)</label>
              <input
                type="text"
                placeholder="e.g. React, Node.js, Python, CSS"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900/50 text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Biography */}
          <div className="space-y-1 text-xs sm:text-sm">
            <label className="text-xs font-semibold text-slate-400">Professional Bio</label>
            <textarea
              placeholder="Write a brief professional summary of your background and career interests..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900/50 text-white focus:outline-none"
            />
          </div>

          {/* Save trigger */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={updating}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer shadow-md"
            >
              <Save className="h-4 w-4" />
              <span>{updating ? 'Saving Profile...' : 'Save Settings'}</span>
            </button>
          </div>

        </GlassCard>
      </form>

      {/* Account Info widgets */}
      <GlassCard className="border border-red-500/10 space-y-4">
        <h3 className="text-sm font-bold uppercase text-white flex items-center gap-1.5">
          <ShieldAlert className="h-4.5 w-4.5 text-red-400" />
          <span>Security Role Standings</span>
        </h3>
        <div className="text-xs sm:text-sm text-slate-300 space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Account Authorization Role:</span>
            <span className="text-teal-400 font-bold uppercase">{user?.role || 'user'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Security Encryption:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Cpu className="h-3.5 w-3.5" /> Activated
            </span>
          </div>
        </div>
      </GlassCard>

    </div>
  );
}
