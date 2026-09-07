'use client';

import React, { useState } from 'react';
import { 
  User, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Upload, 
  Briefcase, 
  Star, 
  ExternalLink,
  ShieldCheck,
  Save
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function FreelancerProfilePage() {
  const { user } = useAuth();
  
  const [name, setName] = useState(user?.name || 'Alex Morgan');
  const [title, setTitle] = useState('Senior Video Editor & Social Media Strategist');
  const [bio, setBio] = useState('Specializing in high-converting 9:16 short-form video content for Instagram Reels, YouTube Shorts, and TikTok. Over 50M+ organic views generated for client campaigns.');
  const [hourlyRate, setHourlyRate] = useState('45');
  const [skills, setSkills] = useState<string[]>(['Premiere Pro', 'After Effects', 'CapCut Pro', 'Figma', 'Reels Strategy', 'Copywriting']);
  const [newSkill, setNewSkill] = useState('');

  // Portfolio items
  const [portfolio, setPortfolio] = useState([
    { id: 'p1', title: 'SaaS App Launch Reel (1.2M Views)', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80', category: 'Video Editing' },
    { id: 'p2', title: 'Fashion Brand Carousel Templates', url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80', category: 'Graphic Design' },
  ]);

  const [savedNotif, setSavedNotif] = useState<string | null>(null);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (!skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotif('✅ Freelancer profile and portfolio updated successfully!');
    setTimeout(() => setSavedNotif(null), 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-purple-500/20">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Freelancer Profile &amp; Portfolio</span>
              <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full border border-purple-500/20">
                Public Marketplace Profile
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showcase your skills, video reel samples, bio, and hourly rates to clients browsing the marketplace.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>Verified Top Creator Badge</span>
        </div>
      </div>

      {savedNotif && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{savedNotif}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (7 cols): Profile Details & Skills */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Basic Creator Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Hourly Rate ($/hr)
                </label>
                <input
                  type="number"
                  required
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Professional Headline / Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                About &amp; Portfolio Bio
              </label>
              <textarea
                rows={4}
                required
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 leading-relaxed"
              />
            </div>

            {/* Skills Tag Input */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Skills &amp; Expertise Tags
              </label>

              <div className="flex flex-wrap gap-2 mb-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20 text-xs font-semibold rounded-xl flex items-center gap-1.5"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-rose-500"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a new skill (e.g. Canva, Motion Graphics)..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(e);
                    }
                  }}
                  className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                >
                  Add
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold rounded-xl text-xs shadow-lg shadow-purple-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </form>
        </div>

        {/* Right Column (5 cols): Portfolio Showcases */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
              <span>Featured Portfolio Work</span>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">{portfolio.length} Samples</span>
            </h3>

            <div className="space-y-4">
              {portfolio.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-950 space-y-2 p-3">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-36 object-cover rounded-xl border border-slate-200 dark:border-slate-800"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h4>
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">{item.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
