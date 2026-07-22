'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import { motion } from 'framer-motion';
import { 
  FileText, Bot, BarChart3, Briefcase, Zap, CheckCircle2, ChevronDown, 
  ArrowRight, Users, Trophy, GraduationCap, Calendar, Star 
} from 'lucide-react';

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const features = [
    {
      icon: FileText,
      title: 'ATS Resume Optimizer',
      desc: 'Upload your PDF resume to run a mock scan against standard HR filters. Identify weaknesses, grammatical issues, and get direct phrasing edits.',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Bot,
      title: 'Agentic Career Coach',
      desc: 'A chat partner trained in career counseling. Get mock interview preparation, salary negotiation advice, and skill roadmaps.',
      color: 'from-teal-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'Cover Letter Generator',
      desc: 'Instantly write custom cover letters tailored to specific jobs, company culture, tone, and experience milestones.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Briefcase,
      title: 'Application Tracker',
      desc: 'Keep tags on roles applied for. Organize by interview schedules, offer tracking, and resume version linkages.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      desc: 'Visualize your progress. Track average ATS scores, monthly application statistics, and skill progression charts.',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: GraduationCap,
      title: 'Course Matchmaker',
      desc: 'Find specific roadmap paths and certification ideas matching skills missing from your parsed document.',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const workflowSteps = [
    { number: '01', title: 'Upload Resume', desc: 'Drag and drop your PDF. The parser reads content directly.' },
    { number: '02', title: 'AI Audit Scan', desc: 'Calculates overall formatting scores and extracts missing keywords.' },
    { number: '03', title: 'Roadmap Blueprint', desc: 'AI recommends custom micro-courses to fill skill gaps.' },
    { number: '04', title: 'Tailored Apply', desc: 'Generate cover letters and save tracking details.' }
  ];

  const mockTemplates = [
    { name: 'SaaS Executive', category: 'Tech / Product', score: '95', downloads: '1.2k', rating: '4.9', img: '🚀' },
    { name: 'Minimalist Professional', category: 'Finance / HR', score: '91', downloads: '2.4k', rating: '4.8', img: '👔' },
    { name: 'Creative Designer', category: 'UX / Marketing', score: '88', downloads: '920', rating: '4.7', img: '🎨' },
    { name: 'Graduate Starter', category: 'Engineering', score: '93', downloads: '1.8k', rating: '4.9', img: '🎓' }
  ];

  const stats = [
    { value: '50k+', label: 'Resumes Analyzed' },
    { value: '94.2%', label: 'ATS Pass Rate' },
    { value: '3.5x', label: 'Faster Interview Calls' },
    { value: '150+', label: 'Job Categories Supported' }
  ];

  const testimonials = [
    {
      quote: "SkillForge helped me optimize my backend engineer resume. I increased my ATS score from 62 to 91. Within two weeks, I had four interviews scheduled!",
      author: "Alex Rivera",
      role: "Backend Engineer, Stripe",
      rating: 5
    },
    {
      quote: "The mock interview practice with the AI Coach was invaluable. It grilled me on React architecture patterns and gave actionable feedback on my explanations.",
      author: "Sophia Chen",
      role: "Front-End Developer, Vercel",
      rating: 5
    },
    {
      quote: "Using the Cover Letter generator saved me hours. Each document felt uniquely written for the company, and the application tracker kept me focused.",
      author: "Marcus Brody",
      role: "Product Manager, Atlassian",
      rating: 5
    }
  ];

  const blogs = [
    {
      title: "Mastering the STAR Method for Engineering Interviews",
      desc: "How to articulate your challenges, tasks, actions, and results with metrics that recruiters love.",
      date: "Jul 18, 2026",
      readTime: "5 min read",
      author: "Samantha Bell"
    },
    {
      title: "Secrets of the ATS: How Filters Screen Resumes in 2026",
      desc: "A look inside applicant tracking software and the exact keyword structures needed to rank high.",
      date: "Jul 12, 2026",
      readTime: "7 min read",
      author: "Devon Miller"
    },
    {
      title: "How to Negotiate Your Remote Salary in Tech",
      desc: "Strategies, phrasing templates, and baseline calculation metrics to prepare you for offer negotiations.",
      date: "Jun 28, 2026",
      readTime: "4 min read",
      author: "Rohan Patel"
    }
  ];

  const faqs = [
    {
      q: "How does the ATS Resume Analyzer calculate my score?",
      a: "The analyzer scans your resume for formatting issues, action verb usage, contact detail structures, and match rate against industry standard skills. It parses these into scores for Formatting and Content quality, giving an overall ATS score."
    },
    {
      q: "Is my resume data kept private?",
      a: "Yes. All resumes, personal details, and chatbot logs are securely encrypted. Your files are accessible only to you through your authenticated account."
    },
    {
      q: "Can I use the Career Coach for any industry?",
      a: "Absolutely. The Coach has broad context on engineering, product design, marketing, data sciences, finance, healthcare, and executive recruitment."
    },
    {
      q: "What is the difference between Guest and User roles?",
      a: "Guests can explore public templates, blogs, and the landing page. Users get full dashboard access: uploading resumes, running AI scoring audits, generating cover letters, chatting with the AI Coach, and tracking active job hunts."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-[#020617]">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-[10vh] left-[5%] h-72 w-72 rounded-full bg-blue-500/10 blur-[120px] animate-blob-1 pointer-events-none" />
      <div className="absolute top-[40vh] right-[10%] h-80 w-80 rounded-full bg-teal-500/10 blur-[130px] animate-blob-2 pointer-events-none" />
      <div className="absolute bottom-[20vh] left-[20%] h-96 w-96 rounded-full bg-orange-500/5 blur-[150px] animate-blob-3 pointer-events-none" />

      <Navbar />

      <main className="flex-grow">
        
        {/* HERO SECTION */}
        <section className="relative flex min-h-[65vh] items-center justify-center px-4 py-16 text-center">
          <div className="max-w-4xl space-y-6">
            
            {/* Tagline Animation */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-sm font-medium text-teal-400"
            >
              <Zap className="h-4 w-4" />
              <span>Next-Gen Agentic AI Career Partner</span>
            </motion.div>

            {/* Main Header */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight"
            >
              Land Your Dream Job with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-400 to-orange-400 glow-primary">
                Agentic AI
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto"
            >
              Generate resumes, optimize ATS scores, receive customized advice from a persistent career coach, and manage all your applications in a professional dashboard.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
            >
              <Link
                href="/login"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-500/20 transition-all"
              >
                <span>Start Free</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>
              <Link
                href="#workflow"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all"
              >
                <span>Watch Demo</span>
              </Link>
            </motion.div>

          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Advanced SaaS Dashboard Features
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
              SkillForge AI combines multiple workflows to give job seekers an unfair advantage in the hiring pool.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <GlassCard key={idx} hoverGlow className="flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${feature.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </section>

        {/* WORKFLOW SECTION */}
        <section id="workflow" className="bg-slate-900/35 border-y border-white/5 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                The Agentic Career Blueprint
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                How our AI optimization process guides you step-by-step.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {workflowSteps.map((step, idx) => (
                <div key={idx} className="relative group">
                  <div className="flex flex-col space-y-3">
                    <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-500/20 to-teal-400/20 group-hover:from-blue-500/40 group-hover:to-teal-400/40 transition-colors">
                      {step.number}
                    </span>
                    <h3 className="text-lg font-bold text-white">{step.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                  {idx < 3 && (
                    <div className="hidden md:block absolute top-6 right-[-20%] w-[35%] h-[1px] bg-gradient-to-r from-blue-500/40 to-transparent" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RESUME TEMPLATES SECTION */}
        <section className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Premium Resume Templates
              </h2>
              <p className="text-slate-400 mt-2">
                Download fully audited designs proven to pass modern ATS filters.
              </p>
            </div>
            <Link 
              href="/templates" 
              className="text-sm font-semibold text-teal-400 flex items-center gap-1 hover:underline hover:text-teal-300"
            >
              <span>Explore All Templates</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {mockTemplates.map((temp, idx) => (
              <GlassCard key={idx} hoverGlow className="overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="aspect-w-3 aspect-h-4 rounded-xl bg-slate-900 flex items-center justify-center text-5xl mb-4 py-8 border border-white/5">
                    {temp.img}
                  </div>
                  <h3 className="text-base font-bold text-white">{temp.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{temp.category}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-semibold">ATS Score: {temp.score}+</span>
                  <span className="text-slate-400">{temp.downloads} DLs</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* STATISTICS SECTION */}
        <section className="bg-gradient-to-r from-blue-600/10 to-teal-500/10 border-y border-white/5 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-3xl sm:text-5xl font-extrabold text-white glow-primary">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-slate-400 uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Backed by Successful Hires
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Students and developers share how SkillForge AI unlocked their dream salaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test, idx) => (
              <GlassCard key={idx} className="flex flex-col justify-between h-full border-t-2 border-t-teal-500/30">
                <div className="space-y-4">
                  <div className="flex gap-1 text-orange-400">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="h-4.5 w-4.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 italic leading-relaxed">
                    &ldquo;{test.quote}&rdquo;
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-teal-400 font-bold">
                    {test.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{test.author}</h4>
                    <p className="text-xs text-slate-500">{test.role}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* CAREER BLOGS SECTION */}
        <section id="blog" className="bg-slate-900/35 border-y border-white/5 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Latest Career Advice
                </h2>
                <p className="text-slate-400 mt-2">
                  Stay updated with deepdives on resume optimization, tech trends, and interviews.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogs.map((blog, idx) => (
                <GlassCard key={idx} hoverGlow className="flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> {blog.date}
                      </span>
                      <span>{blog.readTime}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white hover:text-teal-400 transition-colors cursor-pointer">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{blog.desc}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-slate-400">By {blog.author}</span>
                    <span className="text-teal-400 font-semibold flex items-center gap-0.5 cursor-pointer hover:underline">
                      Read More <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Start completely free, no credit card required. Upgrade for custom roadmap recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <GlassCard className="flex flex-col justify-between relative border border-white/5 bg-slate-950/20">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Starter</h3>
                  <p className="text-sm text-slate-400 mt-1">Perfect for quick resume scoring and reviews.</p>
                </div>
                <div className="flex items-baseline text-white">
                  <span className="text-5xl font-extrabold tracking-tight">$0</span>
                  <span className="ml-1 text-xl font-semibold text-slate-500">/ forever</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-teal-400" />
                    <span>Upload 3 Resumes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-teal-400" />
                    <span>ATS Formatting Audits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-teal-400" />
                    <span>AI Chatbot (10 msgs / day)</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-500">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                    <span>Unlimited Cover Letters</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/login"
                className="mt-8 block w-full rounded-xl border border-white/10 bg-white/5 py-3 text-center text-sm font-semibold text-white hover:bg-white/10 transition-all"
              >
                Sign Up Free
              </Link>
            </GlassCard>

            {/* Pro Plan */}
            <GlassCard className="flex flex-col justify-between relative border border-blue-500/30 bg-blue-950/10 shadow-lg shadow-blue-500/10">
              <div className="absolute top-0 right-6 translate-y-[-50%] rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white uppercase">
                Most Popular
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Professional</h3>
                  <p className="text-sm text-slate-400 mt-1">Full power of career agency optimization.</p>
                </div>
                <div className="flex items-baseline text-white">
                  <span className="text-5xl font-extrabold tracking-tight">$19</span>
                  <span className="ml-1 text-xl font-semibold text-slate-500">/ month</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-teal-400" />
                    <span>Unlimited Resume Uploads & Audits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-teal-400" />
                    <span>Persistent Custom AI Coach (Unlimited)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-teal-400" />
                    <span>Automated Course Matchmaker & Roadmap</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-teal-400" />
                    <span>Unlimited Custom Cover Letters</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-teal-400" />
                    <span>Job Recommendations Sync</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/login"
                className="mt-8 block w-full rounded-xl bg-blue-600 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700 shadow-md hover:shadow-blue-500/25 transition-all animate-pulse"
              >
                Go Professional
              </Link>
            </GlassCard>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="max-w-4xl mx-auto px-4 py-20 sm:px-6 lg:px-8 border-t border-white/5">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <GlassCard key={idx} className="p-4 cursor-pointer" hoverGlow={false}>
                <button
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between text-left font-semibold text-white text-base py-1"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-teal-400 transition-transform duration-300 ${
                    activeFaq === idx ? 'transform rotate-180' : ''
                  }`} />
                </button>
                {activeFaq === idx && (
                  <p className="mt-3 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </p>
                )}
              </GlassCard>
            ))}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="max-w-5xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center">
          <GlassCard className="bg-gradient-to-r from-blue-600/20 via-slate-900/60 to-teal-500/20 border border-blue-500/20 p-12 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
              Optimize Your Career Path Today
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
              Join thousands of students and developers who bypass simple screening algorithms and land interviews 3x faster using SkillForge AI.
            </p>
            <div className="pt-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-8 py-4 text-base font-semibold text-white hover:bg-teal-700 shadow-lg hover:shadow-teal-500/20 transition-all"
              >
                <span>Get Started Now</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>
            </div>
          </GlassCard>
        </section>

      </main>

      <Footer />
    </div>
  );
}
