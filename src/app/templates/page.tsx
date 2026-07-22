'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import GlassCard from '../../components/GlassCard';
import { Search, Award, Download, Star, Filter, Eye } from 'lucide-react';

export default function TemplatesListPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const mockTemplates = [
    { id: 'saas-exec', name: 'SaaS Executive Pro', category: 'Product & Tech', score: '95', downloads: '1,240', rating: '4.9', desc: 'Sleek dark layout with sections matching modern tech companies.', img: '🚀' },
    { id: 'minimal-prof', name: 'Minimalist Professional', category: 'Finance & HR', score: '91', downloads: '2,450', rating: '4.8', desc: 'Clean formatting, great for traditional corporate interviews.', img: '👔' },
    { id: 'creative-des', name: 'Creative Designer', category: 'Design & Marketing', score: '88', downloads: '920', rating: '4.7', desc: 'Focuses on visual layout structure and project highlights.', img: '🎨' },
    { id: 'grad-starter', name: 'Graduate Starter Blueprint', category: 'Engineering & QA', score: '93', downloads: '1,890', rating: '4.9', desc: 'Accentuates university projects, courses, and internship milestones.', img: '🎓' },
    { id: 'marketing-exec', name: 'Growth Marketing Executive', category: 'Design & Marketing', score: '92', downloads: '1,105', rating: '4.8', desc: 'Highlights data conversion milestones, campaigns, and KPIs.', img: '📈' },
    { id: 'sales-director', name: 'Sales Director Blueprint', category: 'Finance & HR', score: '90', downloads: '1,420', rating: '4.6', desc: 'Organizes contract counts, business developer wins, and achievements.', img: '💼' }
  ];

  const categories = ['All', 'Product & Tech', 'Finance & HR', 'Design & Marketing', 'Engineering & QA'];

  const filteredTemplates = mockTemplates.filter(temp => {
    const matchSearch = temp.name.toLowerCase().includes(search.toLowerCase()) || temp.desc.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || temp.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#020617] relative">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Explore ATS-Friendly Templates
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Choose from templates designed in accordance with HR system metrics. Test your text against them to pass scans instantly.
          </p>
        </div>

        {/* Filters and search controls */}
        <GlassCard className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between border border-white/5 bg-slate-950/20 mb-8">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search designs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-white/10 bg-slate-900 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
            <Filter className="h-4 w-4 text-slate-500" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-white/10 bg-slate-900 text-xs text-slate-300 focus:outline-none"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </GlassCard>

        {/* Grid List */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredTemplates.map((temp) => (
              <GlassCard key={temp.id} hoverGlow className="flex flex-col justify-between h-full">
                <div>
                  <div className="aspect-w-3 aspect-h-4 rounded-2xl bg-slate-900 flex items-center justify-center text-6xl py-12 border border-white/5 mb-4 select-none">
                    {temp.img}
                  </div>
                  
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-bold text-white text-base truncate">{temp.name}</h3>
                      <span className="text-xs text-slate-500 font-semibold">{temp.category}</span>
                    </div>
                    <div className="flex items-center gap-1 border border-emerald-500/20 bg-emerald-500/10 rounded px-2 py-0.5 text-xs text-emerald-400 font-bold">
                      <Award className="h-3 w-3" />
                      <span>{temp.score}+</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                    {temp.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <div className="flex space-x-3 text-slate-500">
                    <span className="flex items-center gap-1">
                      <Download className="h-3.5 w-3.5" /> {temp.downloads}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-current text-orange-400" /> {temp.rating}
                    </span>
                  </div>

                  <Link
                    href={`/templates/${temp.id}`}
                    className="flex items-center gap-1 text-teal-400 font-semibold hover:underline hover:text-teal-300 transition-all cursor-pointer"
                  >
                    <span>View Details</span>
                    <Eye className="h-3.5 w-3.5" />
                  </Link>
                </div>

              </GlassCard>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500 text-sm">
            No templates match your search filter criteria.
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
