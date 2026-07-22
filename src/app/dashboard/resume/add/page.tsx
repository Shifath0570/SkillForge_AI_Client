'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import GlassCard from '../../../../components/GlassCard';
import { api } from '../../../../utils/api';
import toast from 'react-hot-toast';
import { FileText, ArrowLeft, Upload, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AddResumePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [industry, setIndustry] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Entry-Level');
  const [skills, setSkills] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  
  // Loader and progress steps states
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    'Uploading PDF resume document...',
    'Extracting structured texts and metrics...',
    'Initiating ATS formatting audit scan...',
    'AI agent matching keywords & course roadmaps...',
    'Compiling final analytics report...'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Only PDF files are supported');
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size exceeds 10MB limit');
        return;
      }
      setFile(selectedFile);
    }
  };

  const runProgressBar = () => {
    setCurrentStep(0);
    const intervals = [1200, 1800, 2200, 2800];
    
    intervals.forEach((delay, index) => {
      setTimeout(() => {
        setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
      }, delay);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !industry || !file) {
      return toast.error('Please fill in title, industry, and select a PDF file');
    }

    setLoading(true);
    runProgressBar();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('industry', industry);
    formData.append('experienceLevel', experienceLevel);
    formData.append('skills', skills);
    formData.append('description', description);
    formData.append('file', file);

    try {
      const res = await api.resumes.create(formData);
      if (res.success && res.resume) {
        toast.success('Resume analyzed successfully!');
        // redirect to services dashboard pointing to the resume ID
        router.push(`/dashboard/ai-generator?resumeId=${res.resume._id}`);
      }
    } catch (err) {
      toast.error('Error occurred during resume analysis');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      
      {/* Back button */}
      <div>
        <Link
          href="/dashboard/resume"
          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to My Resumes</span>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <FileText className="h-6 w-6 text-blue-500" />
        <h1 className="text-2xl font-bold text-white tracking-tight">Upload Resume & Audit</h1>
      </div>

      {!loading ? (
        <form onSubmit={handleSubmit}>
          <GlassCard className="space-y-4 border border-white/5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Resume Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Front-End React Developer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-900/50 text-xs text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              {/* Target Industry */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Target Industry *</label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineering / Tech"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-900/50 text-xs text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Experience level */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Experience Level *</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-900/50 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Internship">Internship</option>
                  <option value="Entry-Level">Entry-Level</option>
                  <option value="Mid-Level">Mid-Level</option>
                  <option value="Senior-Level">Senior-Level</option>
                  <option value="Lead / Executive">Lead / Executive</option>
                </select>
              </div>

              {/* Tagging fallback keywords */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Core Skills (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, TypeScript, Git"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-900/50 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Description / Job Description Notes</label>
              <textarea
                placeholder="Paste the target job description or summarize your career goals here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-900/50 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* PDF upload field */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-slate-400">Upload PDF Resume *</label>
              <div className="border border-dashed border-white/15 rounded-2xl p-6 hover:border-blue-500/50 hover:bg-blue-600/5 transition-all text-center cursor-pointer relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  required
                />
                <div className="flex flex-col items-center space-y-2 pointer-events-none">
                  <Upload className="h-8 w-8 text-slate-500" />
                  <span className="text-xs text-slate-400">
                    {file ? `Selected file: ${file.name}` : 'Drag & drop or click to choose PDF file'}
                  </span>
                  <span className="text-[10px] text-slate-600">PDF documents only, max size 10MB</span>
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 shadow-md cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Upload & Initiate Audit Scan</span>
              </button>
            </div>

          </GlassCard>
        </form>
      ) : (
        /* Agent Processing Progress View */
        <GlassCard className="flex flex-col items-center justify-center py-16 space-y-6 text-center border border-teal-500/20 bg-slate-950/40">
          <div className="relative flex items-center justify-center">
            <Loader2 className="h-16 w-16 text-teal-400 animate-spin" />
            <Sparkles className="h-6 w-6 text-blue-500 absolute animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">Analyzing Your Resume</h3>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
          <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <p className="text-sm font-medium text-teal-400 animate-pulse">
            {steps[currentStep]}
          </p>
        </GlassCard>
      )}

    </div>
  );
}
