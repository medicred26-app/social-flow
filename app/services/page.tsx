'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, 
  Search, 
  Star, 
  Clock, 
  CheckCircle2, 
  UserPlus, 
  Wand2, 
  Filter, 
  Sparkles, 
  ShieldCheck, 
  Plus, 
  X,
  FileText,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { FreelancerProfile, ServiceCategory, Project } from '@/types';
import { getStoredFreelancers, getStoredClientProjects, saveStoredClientProjects } from '@/lib/store';

export default function ServicesPage() {
  const router = useRouter();
  const [freelancers, setFreelancers] = useState<FreelancerProfile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hireModalFreelancer, setHireModalFreelancer] = useState<FreelancerProfile | null>(null);

  // Hire Project Form State
  const [projectTitle, setProjectTitle] = useState('Custom Video Editing Project');
  const [projectDesc, setProjectDesc] = useState('Edit raw video clips into 9:16 vertical Reels format with custom color grading and viral subtitles.');
  const [notif, setNotif] = useState<string | null>(null);

  useEffect(() => {
    setFreelancers(getStoredFreelancers());

    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const cat = urlParams.get('category');
      if (cat) setSelectedCategory(cat);

      // Restore hire context if navigated from Content Studio or Library
      const hireContext = sessionStorage.getItem('socialflow_hire_context');
      if (hireContext) {
        try {
          const parsed = JSON.parse(hireContext);
          if (parsed.title) setProjectTitle(`Improve: ${parsed.title}`);
        } catch (e) {}
      }
    }
  }, []);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hireModalFreelancer) return;

    const price = hireModalFreelancer.startingPrice;
    const platformFee = Math.round(price * 0.15); // 15% configurable platform fee
    const freelancerEarnings = price - platformFee;

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: projectTitle,
      description: projectDesc,
      category: hireModalFreelancer.categories[0] || 'video_editing',
      clientId: 'user-demo',
      clientName: 'Alex Morgan',
      freelancerId: hireModalFreelancer.id,
      freelancerName: hireModalFreelancer.name,
      freelancerAvatar: hireModalFreelancer.avatarUrl,
      price,
      platformFee,
      freelancerEarnings,
      status: 'in_progress',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const currentProjects = getStoredClientProjects();
    saveStoredClientProjects([newProject, ...currentProjects]);

    setHireModalFreelancer(null);
    setNotif(`🚀 Hired ${hireModalFreelancer.name}! Project "${projectTitle}" created successfully.`);
    setTimeout(() => {
      setNotif(null);
      router.push('/projects');
    }, 1500);
  };

  const CATEGORIES: { id: string; label: string }[] = [
    { id: 'all', label: 'All Services' },
    { id: 'video_editing', label: '✂️ Video Editors' },
    { id: 'thumbnail_design', label: '🖼️ Thumbnail Designers' },
    { id: 'graphic_design', label: '🎨 Graphic Designers' },
    { id: 'seo_specialist', label: '📈 SEO Specialists' },
    { id: 'social_media_manager', label: '📱 Social Media Managers' },
    { id: 'motion_graphics', label: '🎬 Motion Graphics' }
  ];

  const filteredFreelancers = freelancers.filter(f => {
    const matchesCategory = selectedCategory === 'all' || f.categories.includes(selectedCategory as ServiceCategory);
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-purple-600 via-pink-600 to-rose-500 text-white rounded-2xl shadow-lg shadow-purple-500/20">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Services &amp; Freelancer Marketplace
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hire top-rated video editors, thumbnail designers, and social growth specialists
            </p>
          </div>
        </div>

        {/* AI Alternative Banner CTA */}
        <button
          onClick={() => router.push('/content-studio')}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          <Wand2 className="w-4 h-4 text-indigo-500" />
          <span>Use AI Instead</span>
        </button>
      </div>

      {notif && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notif}</span>
        </div>
      )}

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills, editors, designers..."
            className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Freelancers Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFreelancers.map((freelancer) => (
          <div
            key={freelancer.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              {/* Header Info */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={freelancer.avatarUrl}
                    alt={freelancer.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-purple-500/30"
                  />
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
                      {freelancer.name}
                    </h3>
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                      {freelancer.handle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-xl text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{freelancer.rating} ({freelancer.reviewCount})</span>
                </div>
              </div>

              {/* Title & Bio */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{freelancer.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {freelancer.bio}
                </p>
              </div>

              {/* Skills Badges */}
              <div className="flex flex-wrap gap-1.5">
                {freelancer.skills.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold rounded-lg">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Portfolio Preview Image */}
              {freelancer.portfolio[0] && (
                <div className="rounded-2xl overflow-hidden aspect-video bg-slate-950 border border-slate-800 relative group">
                  <img
                    src={freelancer.portfolio[0].imageUrl}
                    alt={freelancer.portfolio[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-3 flex items-end">
                    <span className="text-[11px] font-semibold text-white truncate">
                      📁 {freelancer.portfolio[0].title}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Price Footer & Hire Action */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Starting at</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">
                  ₹{freelancer.startingPrice.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => setHireModalFreelancer(freelancer)}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/25 transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Hire Freelancer</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Hire Freelancer Project Order Modal */}
      {hireModalFreelancer && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-in zoom-in-95 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={hireModalFreelancer.avatarUrl}
                  alt={hireModalFreelancer.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Hire {hireModalFreelancer.name}
                  </h3>
                  <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                    {hireModalFreelancer.title}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setHireModalFreelancer(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Project Brief &amp; Requirements
                </label>
                <textarea
                  rows={4}
                  required
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Pricing & Platform Commission Breakdown */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Project Price:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹{hireModalFreelancer.startingPrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>SocialFlow Platform Fee (15%):</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    ₹{Math.round(hireModalFreelancer.startingPrice * 0.15).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                  <span>Freelancer Net Earnings:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{Math.round(hireModalFreelancer.startingPrice * 0.85).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setHireModalFreelancer(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/25 hover:opacity-95 transition-all"
                >
                  Submit Order &amp; Start Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
