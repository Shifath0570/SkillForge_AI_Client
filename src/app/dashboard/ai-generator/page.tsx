'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import GlassCard from '../../../components/GlassCard';
import Skeleton from '../../../components/Skeleton';
import { api } from '../../../utils/api';
import toast from 'react-hot-toast';
import { 
  FileText, Bot, Sparkles, Award, AlertTriangle, CheckCircle2, 
  BookOpen, Briefcase, Tag, Plus, X, Copy, Download, RefreshCw, Send, Eye, Loader2
} from 'lucide-react';

export default function AIGeneratorServices() {
  const searchParams = useSearchParams();
  const initialResumeId = searchParams?.get('resumeId') || '';

  // Tab state: 'analyzer' or 'cover-letter'
  const [activeTab, setActiveTab] = useState<'analyzer' | 'cover-letter'>('analyzer');

  // Resume Analyzer States
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState(initialResumeId);
  const [selectedResume, setSelectedResume] = useState<any>(null);
  const [loadingResume, setLoadingResume] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Cover Letter States
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [generatingLetter, setGeneratingLetter] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');

  // Fetch all resumes for the dropdown selection
  useEffect(() => {
    const loadResumes = async () => {
      try {
        const res = await api.resumes.getAll();
        if (res.success && res.resumes) {
          setResumes(res.resumes);
          if (res.resumes.length > 0) {
            // Set initial selected resume
            if (initialResumeId) {
              setSelectedResumeId(initialResumeId);
            } else {
              setSelectedResumeId(res.resumes[0]._id);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching resumes:', err);
      }
    };
    loadResumes();
  }, [initialResumeId]);

  // Fetch selected resume details
  useEffect(() => {
    if (!selectedResumeId) return;

    const loadResumeDetails = async () => {
      setLoadingResume(true);
      try {
        const res = await api.resumes.getById(selectedResumeId);
        if (res.success && res.resume) {
          setSelectedResume(res.resume);
          // Autofill skills if viewing cover letter tab
          if (res.resume.tags && res.resume.tags.length > 0) {
            setSkills(res.resume.tags.join(', '));
          }
        }
      } catch (err) {
        console.error('Error loading resume details:', err);
      } finally {
        setLoadingResume(false);
      }
    };
    loadResumeDetails();
  }, [selectedResumeId]);

  // Handle auto tagging - add tag
  const handleAddTag = async () => {
    if (!newTag.trim() || !selectedResume) return;
    const cleanTag = newTag.trim();
    if (selectedResume.tags.includes(cleanTag)) {
      return toast.error('Tag already exists');
    }

    const updatedTags = [...selectedResume.tags, cleanTag];
    try {
      const res = await api.resumes.updateTags(selectedResume._id, updatedTags);
      if (res.success) {
        setSelectedResume({ ...selectedResume, tags: updatedTags });
        setNewTag('');
        toast.success('Tag added successfully');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update tags');
    }
  };

  // Handle auto tagging - remove tag
  const handleRemoveTag = async (tagToRemove: string) => {
    if (!selectedResume) return;
    const updatedTags = selectedResume.tags.filter((t: string) => t !== tagToRemove);
    try {
      const res = await api.resumes.updateTags(selectedResume._id, updatedTags);
      if (res.success) {
        setSelectedResume({ ...selectedResume, tags: updatedTags });
        toast.success('Tag removed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove tag');
    }
  };

  // Cover Letter generation submit
  const handleGenerateCoverLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !company || !experience || !skills) {
      return toast.error('Please fill in job title, company, experience, and core skills');
    }

    setGeneratingLetter(true);
    setGeneratedLetter('');
    try {
      const res = await api.ai.generateCoverLetter({
        jobTitle,
        company,
        experience,
        skills,
        tone,
        length,
        resumeId: selectedResumeId || null
      });

      if (res.success && res.coverLetter) {
        setGeneratedLetter(res.coverLetter.content);
        toast.success('Cover letter generated!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Generation failed');
    } finally {
      setGeneratingLetter(false);
    }
  };

  // Helper copy content
  const handleCopyLetter = () => {
    if (!generatedLetter) return;
    navigator.clipboard.writeText(generatedLetter);
    toast.success('Cover letter copied to clipboard');
  };

  // PDF Export simulation (simple window print of letter or report download)
  const handleExportLetterPDF = () => {
    if (!generatedLetter) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Cover Letter - ${jobTitle} at ${company}</title>
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
              p { margin-bottom: 20px; font-size: 14px; }
              .header { margin-bottom: 40px; font-size: 13px; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              Generated via SkillForge AI
            </div>
            ${generatedLetter.replace(/\n/g, '<br/>')}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  // Resume report printable PDF export
  const handleExportReportPDF = () => {
    if (!selectedResume) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>ATS Audit Report - ${selectedResume.title}</title>
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
              h1 { font-size: 24px; border-bottom: 2px solid #2563EB; padding-bottom: 10px; margin-bottom: 5px; }
              .meta { font-size: 14px; color: #666; margin-bottom: 20px; }
              .score-box { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 18px; font-weight: bold; color: #166534; }
              h2 { font-size: 18px; color: #0f172a; margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
              ul { padding-left: 20px; }
              li { font-size: 14px; margin-bottom: 8px; }
            </style>
          </head>
          <body>
            <h1>ATS Audit & Optimization Report</h1>
            <div class="meta">
              Resume: ${selectedResume.title} | Industry: ${selectedResume.industry} | Created: ${new Date(selectedResume.createdAt).toLocaleDateString()}
            </div>
            <div class="score-box">
              Overall ATS Score: ${selectedResume.atsScore}%
            </div>
            
            <h2>Resume Weaknesses Identified</h2>
            <ul>
              ${selectedResume.analysisResults?.weakSections?.map((w: string) => `<li>${w}</li>`).join('') || '<li>None identified</li>'}
            </ul>

            <h2>Missing Core Skills</h2>
            <ul>
              ${selectedResume.analysisResults?.missingSkills?.map((ms: string) => `<li>${ms}</li>`).join('') || '<li>None identified</li>'}
            </ul>

            <h2>Actionable Recommendations</h2>
            <ul>
              ${selectedResume.analysisResults?.recommendations?.map((r: string) => `<li>${r}</li>`).join('') || '<li>None identified</li>'}
            </ul>

            <h2>Skills Tags Registered</h2>
            <p>${selectedResume.tags?.join(', ') || 'None'}</p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400';
    if (score >= 70) return 'text-blue-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-rose-400';
  };

  return (
    <div className="space-y-6">
      
      {/* Header tab navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-1.5">
            <Sparkles className="h-6 w-6 text-teal-400 animate-pulse" />
            <span>AI Workspace Services</span>
          </h1>
          <p className="text-sm text-slate-400">
            Audit your resume with ATS agents and generate context-tailored cover letters.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'analyzer'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>ATS Resume Auditor</span>
          </button>
          <button
            onClick={() => setActiveTab('cover-letter')}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'cover-letter'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="h-4 w-4" />
            <span>Cover Letter Writer</span>
          </button>
        </div>
      </div>

      {/* Dropdown selectors if resumes exist */}
      {activeTab === 'analyzer' && resumes.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold uppercase">Active Resume:</span>
          <select
            value={selectedResumeId}
            onChange={(e) => setSelectedResumeId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-white/10 bg-slate-900 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            {resumes.map((r) => (
              <option key={r._id} value={r._id}>{r.title} ({r.industry})</option>
            ))}
          </select>
        </div>
      )}

      {/* Tab 1: ATS Resume Auditor */}
      {activeTab === 'analyzer' && (
        <>
          {resumes.length === 0 ? (
            <div className="py-16 text-center max-w-md mx-auto border border-dashed border-white/10 rounded-2xl p-6">
              <FileText className="h-12 w-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No resumes found</h3>
              <p className="text-xs text-slate-500 mt-2">
                You must upload a PDF resume before using the Auditor.
              </p>
              <Link
                href="/dashboard/resume/add"
                className="mt-4 inline-block rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition-all"
              >
                Upload First Resume
              </Link>
            </div>
          ) : loadingResume || !selectedResume ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => <Skeleton key={i} variant="rect" className="h-32" />)}
              </div>
              <Skeleton variant="rect" className="h-72" />
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Score breakdown metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Overall Score widget */}
                <GlassCard className="flex flex-col items-center justify-center text-center p-6 border border-teal-500/20 bg-teal-500/5">
                  <div className="relative flex items-center justify-center h-28 w-28 rounded-full border-4 border-slate-800 bg-slate-950/60 mb-3">
                    <span className={`text-3xl font-extrabold ${getScoreColor(selectedResume.atsScore)}`}>
                      {selectedResume.atsScore}%
                    </span>
                  </div>
                  <h3 className="font-bold text-white">Overall ATS Score</h3>
                  <p className="text-xs text-slate-400 mt-1">Audit score scanned by core AI agent</p>
                </GlassCard>

                {/* Formatting Score */}
                <GlassCard className="flex flex-col items-center justify-center text-center p-6">
                  <div className="relative flex items-center justify-center h-28 w-28 rounded-full border-4 border-slate-800 bg-slate-950/60 mb-3">
                    <span className="text-3xl font-extrabold text-blue-400">
                      {selectedResume.analysisResults?.formattingScore || selectedResume.atsScore - 4}%
                    </span>
                  </div>
                  <h3 className="font-bold text-white">Formatting Score</h3>
                  <p className="text-xs text-slate-400 mt-1">Font sizing, structure & parseability</p>
                </GlassCard>

                {/* Content Score */}
                <GlassCard className="flex flex-col items-center justify-center text-center p-6">
                  <div className="relative flex items-center justify-center h-28 w-28 rounded-full border-4 border-slate-800 bg-slate-950/60 mb-3">
                    <span className="text-3xl font-extrabold text-purple-400">
                      {selectedResume.analysisResults?.contentScore || selectedResume.atsScore + 3}%
                    </span>
                  </div>
                  <h3 className="font-bold text-white">Content Score</h3>
                  <p className="text-xs text-slate-400 mt-1">Relevancy, metrics, and action verbs</p>
                </GlassCard>

              </div>

              {/* Action and detail breakdown panels */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Weaknesses & Recommendations */}
                <div className="space-y-6">
                  
                  {/* Weakness list */}
                  <GlassCard className="space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                      <AlertTriangle className="h-5 w-5 text-orange-400" />
                      <span>Audit Weaknesses Identified</span>
                    </h3>
                    <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                      {selectedResume.analysisResults?.weakSections?.map((weak: string, idx: number) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-orange-400 font-bold">•</span>
                          <span>{weak}</span>
                        </li>
                      )) || (
                        <li className="text-slate-500">None detected. Good work!</li>
                      )}
                    </ul>
                  </GlassCard>

                  {/* Recommendations */}
                  <GlassCard className="space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      <span>Actionable Edit Blueprint</span>
                    </h3>
                    <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                      {selectedResume.analysisResults?.recommendations?.map((rec: string, idx: number) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{rec}</span>
                        </li>
                      )) || (
                        <li className="text-slate-500">None compiled.</li>
                      )}
                    </ul>
                  </GlassCard>

                </div>

                {/* Missing Skills, course pathways, job listings */}
                <div className="space-y-6">
                  
                  {/* Auto tags / editable skills */}
                  <GlassCard className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                        <Tag className="h-5 w-5 text-blue-400" />
                        <span>Resume Auto Tagging</span>
                      </h3>
                      <span className="text-xs text-slate-500 font-semibold">
                        {selectedResume.tags?.length || 0} skills detected
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {selectedResume.tags?.map((tag: string) => (
                        <span key={tag} className="flex items-center gap-1 text-xs bg-slate-900 border border-white/10 text-slate-300 px-3 py-1.5 rounded-xl">
                          <span>{tag}</span>
                          <button 
                            onClick={() => handleRemoveTag(tag)}
                            className="text-slate-500 hover:text-red-400 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Add tags bulk input */}
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Add skill tag..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                        className="flex-grow px-3 py-2 rounded-xl border border-white/10 bg-slate-900 text-xs text-white focus:outline-none"
                      />
                      <button
                        onClick={handleAddTag}
                        className="rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer"
                      >
                        Add
                      </button>
                    </div>

                  </GlassCard>

                  {/* Missing Skills list */}
                  <GlassCard className="space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                      <X className="h-5 w-5 text-red-400" />
                      <span>Missing Industry Skills</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedResume.analysisResults?.missingSkills?.map((ms: string, idx: number) => (
                        <span key={idx} className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full">
                          {ms}
                        </span>
                      )) || (
                        <span className="text-slate-500 text-xs">All skills mapped!</span>
                      )}
                    </div>
                  </GlassCard>

                </div>

              </div>

              {/* Course roadmap pathways and Job Suggestions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Courses */}
                <GlassCard className="space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    <BookOpen className="h-5 w-5 text-teal-400" />
                    <span>Recommended Course Roadmap</span>
                  </h3>
                  <div className="space-y-3">
                    {selectedResume.analysisResults?.courses?.map((course: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-3 border border-white/5 bg-white/5 rounded-xl text-xs sm:text-sm">
                        <div>
                          <h4 className="font-bold text-white">{course.name}</h4>
                          <span className="text-xs text-slate-500">Provider: {course.provider}</span>
                        </div>
                        <a 
                          href={course.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-all"
                        >
                          Learn
                        </a>
                      </div>
                    )) || (
                      <p className="text-slate-500 text-xs">No specific courses suggested.</p>
                    )}
                  </div>
                </GlassCard>

                {/* Job Suggestions */}
                <GlassCard className="space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    <Briefcase className="h-5 w-5 text-blue-400" />
                    <span>AI Recommended Job Roles</span>
                  </h3>
                  <div className="space-y-3">
                    {selectedResume.analysisResults?.suggestedJobs?.map((job: any, idx: number) => (
                      <div key={idx} className="p-3 border border-white/5 bg-white/5 rounded-xl space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h4 className="font-bold text-white">{job.title}</h4>
                            <span className="text-xs text-slate-500">{job.company}</span>
                          </div>
                          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-xs">
                            {job.matchPercentage}% Match
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 italic">
                          {job.reasoning}
                        </p>
                      </div>
                    )) || (
                      <p className="text-slate-500 text-xs">No specific positions matched.</p>
                    )}
                  </div>
                </GlassCard>

              </div>

              {/* PDF report download action */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleExportReportPDF}
                  className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-700 shadow-md transition-all cursor-pointer"
                >
                  <Download className="h-4.5 w-4.5" />
                  <span>Download Complete ATS Audit Report (PDF)</span>
                </button>
              </div>

            </div>
          )}
        </>
      )}

      {/* Tab 2: Cover Letter Writer */}
      {activeTab === 'cover-letter' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Creator inputs */}
          <GlassCard className="border border-white/5 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Sparkles className="h-5 w-5 text-teal-400" />
              <span>Cover Letter Parameters</span>
            </h3>

            <form onSubmit={handleGenerateCoverLetter} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Target Title */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Target Job Title *</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Node Backend Engineer"
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-slate-900 text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* Target Company */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Target Company Name *</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Stripe"
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-slate-900 text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Experience */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Years of Experience *</label>
                  <input
                    type="text"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 3 years"
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-slate-900 text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* Desired length */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Word Length</label>
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-slate-900 text-white focus:outline-none"
                  >
                    <option value="short">Short (~150 words)</option>
                    <option value="medium">Medium (~300 words)</option>
                    <option value="long">Long (~450 words)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tone select */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Tone of Writing</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-slate-900 text-white focus:outline-none"
                  >
                    <option value="professional">Professional / Direct</option>
                    <option value="enthusiastic">Enthusiastic / Energetic</option>
                    <option value="confident">Confident / Bold</option>
                    <option value="academic">Formal / Academic</option>
                  </select>
                </div>

                {/* Select associated resume context */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Resume Context</label>
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-slate-900 text-white focus:outline-none"
                  >
                    <option value="">None (Use manual text input)</option>
                    {resumes.map(r => (
                      <option key={r._id} value={r._id}>{r.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Specific Skills input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Core Skills & Stacks to Highlight *</label>
                <textarea
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. Node, React, TypeScript, GraphQL, AWS"
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-white/10 bg-slate-900 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={generatingLetter}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 shadow-md cursor-pointer"
                >
                  {generatingLetter ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Generating Cover Letter...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Write Cover Letter</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </GlassCard>

          {/* Letter Output Panel */}
          <GlassCard className="border border-white/5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  <FileText className="h-5 w-5 text-blue-400" />
                  <span>Generated Document</span>
                </h3>
                {generatedLetter && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCopyLetter}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                      title="Copy to clipboard"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={handleExportLetterPDF}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                      title="Export as PDF"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {generatedLetter ? (
                <div className="whitespace-pre-line text-xs sm:text-sm text-slate-300 leading-relaxed max-h-[400px] overflow-y-auto pr-2">
                  {generatedLetter}
                </div>
              ) : generatingLetter ? (
                <div className="h-44 flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="h-8 w-8 text-teal-400 animate-spin" />
                  <p className="text-xs text-slate-500 animate-pulse">Consulting executive AI writer...</p>
                </div>
              ) : (
                <div className="h-44 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-slate-500 text-xs sm:text-sm">
                  Document outputs will print here. Specify parameters and click Generate.
                </div>
              )}
            </div>

            {generatedLetter && (
              <div className="pt-6 border-t border-white/5 flex gap-2">
                <button
                  onClick={handleGenerateCoverLetter}
                  className="flex-grow flex items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs sm:text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Regenerate letter</span>
                </button>
              </div>
            )}
          </GlassCard>

        </div>
      )}

    </div>
  );
}
