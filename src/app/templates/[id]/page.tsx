'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import GlassCard from '../../../components/GlassCard';
import { Award, ArrowLeft, Download, CheckCircle2, Star, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TemplateDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const mockTemplates: Record<string, any> = {
    'saas-exec': { name: 'SaaS Executive Pro', category: 'Product & Tech', score: '95', downloads: '1,240', rating: '4.9', img: '🚀', desc: 'Designed for engineering managers, tech leads, and backend engineers looking to land roles in modern SaaS industries.', details: 'Includes segments for cloud tech stacks, quantified system engineering metrics, and leadership KPIs.' },
    'minimal-prof': { name: 'Minimalist Professional', category: 'Finance & HR', score: '91', downloads: '2,450', rating: '4.8', img: '👔', desc: 'Sleek, traditional formatting perfect for executive analysts, accountant leads, and HR directors.', details: 'Optimized formatting rules to guarantee errorless scanning across legacy Applicant Tracking Systems.' },
    'creative-des': { name: 'Creative Designer', category: 'Design & Marketing', score: '88', downloads: '920', rating: '4.7', img: '🎨', desc: 'Vibrant UX blueprint optimized to display portfolio projects alongside core skills.', details: 'Tailored for graphic designers, UX leads, copywriters, and branding specialists.' },
    'grad-starter': { name: 'Graduate Starter Blueprint', category: 'Engineering & QA', score: '93', downloads: '1,890', rating: '4.9', img: '🎓', desc: 'Excellent layout for final year students and juniors highlight course metrics and code repositories.', details: 'Puts extra emphasis on projects, programming languages, tools, and internship roles.' }
  };

  const template = mockTemplates[id] || mockTemplates['saas-exec'];

  const handleDownload = () => {
    toast.success('Downloading template document package...');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#020617] relative">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-12 sm:px-6 lg:px-8 space-y-6">
        
        {/* Back Link */}
        <div>
          <Link
            href="/templates"
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Explorer</span>
          </Link>
        </div>

        {/* Content Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Preview Card */}
          <div className="md:col-span-1 space-y-6">
            <GlassCard className="flex flex-col items-center text-center p-6 bg-slate-950/40">
              <div className="aspect-w-3 aspect-h-4 w-full rounded-2xl bg-slate-900 flex items-center justify-center text-7xl py-16 border border-white/5 mb-4 select-none">
                {template.img}
              </div>
              <h2 className="text-xl font-bold text-white">{template.name}</h2>
              <span className="text-xs text-slate-500 font-semibold mt-1">{template.category}</span>
              
              <div className="mt-4 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl text-xs text-emerald-400 font-bold">
                <Award className="h-4 w-4" />
                <span>ATS Compatible: {template.score}%</span>
              </div>
            </GlassCard>
          </div>

          {/* Right Descriptions Card */}
          <div className="md:col-span-2 space-y-6">
            <GlassCard className="space-y-6">
              
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">{template.name} Details</h1>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  {template.desc}
                </p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed italic">
                  {template.details}
                </p>
              </div>

              {/* Compatibility checklists */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Scan checklist compatibility</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-teal-400" />
                    <span>Single-column parse-safe layout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-teal-400" />
                    <span>Standard font sizing rules (Inter/Arial)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-teal-400" />
                    <span>Clear section header breaks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-teal-400" />
                    <span>Quantified bullet points templates</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Download className="h-4 w-4" /> {template.downloads} downloads
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current text-orange-400" /> {template.rating} rating (based on 40 reviews)
                  </span>
                </div>

                <button
                  onClick={handleDownload}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-6 py-3 text-xs font-semibold text-white hover:bg-blue-700 shadow-md cursor-pointer"
                >
                  <Download className="h-4.5 w-4.5" />
                  <span>Download Doc Package</span>
                </button>
              </div>

            </GlassCard>

            {/* Verification Shield */}
            <GlassCard className="border border-teal-500/10 flex items-center space-x-3">
              <ShieldCheck className="h-8 w-8 text-teal-400 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">SkillForge AI Verified</h4>
                <p className="text-xs text-slate-400 mt-1">
                  This design has been successfully tested against 15+ modern Applicant Tracking Systems including Workday, Greenhouse, and Lever.
                </p>
              </div>
            </GlassCard>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
