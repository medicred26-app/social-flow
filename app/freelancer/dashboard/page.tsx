'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserCheck, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Briefcase, 
  Upload, 
  ShieldCheck, 
  Sparkles, 
  Edit, 
  Star, 
  Layers,
  Send,
  Plus
} from 'lucide-react';
import { FreelancerProfile, Project } from '@/types';
import { getStoredFreelancers, saveStoredFreelancers, getStoredClientProjects, saveStoredClientProjects } from '@/lib/store';

export default function FreelancerDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Deliverable Submission Form State
  const [deliverableTitle, setDeliverableTitle] = useState('Final Video Edit (9:16 Reels Format)');
  const [deliverableMediaUrl, setDeliverableMediaUrl] = useState('https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80');
  const [deliverableThumbnailUrl, setDeliverableThumbnailUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80');
  const [deliverableCaption, setDeliverableCaption] = useState('🚀 High-converting video edit complete with viral subtitles!');
  const [deliverableHashtags, setDeliverableHashtags] = useState('#VideoEditing #SocialFlow #ViralReels');
  const [deliverableNotes, setDeliverableNotes] = useState('Included high-contrast typography and 9:16 vertical export ready for publishing.');
  const [notif, setNotif] = useState<string | null>(null);

  useEffect(() => {
    const list = getStoredFreelancers();
    if (list.length > 0) setProfile(list[0]);
    setProjects(getStoredClientProjects());
  }, []);

  const handleSubmitDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;

    const hashtagsArr = deliverableHashtags.split(' ').map(t => t.trim()).filter(Boolean);

    const updatedProjects = projects.map(p => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          status: 'review_requested' as const,
          deliverable: {
            id: `deliv-${Date.now()}`,
            title: deliverableTitle,
            mediaUrl: deliverableMediaUrl,
            mediaType: 'video' as const,
            thumbnailUrl: deliverableThumbnailUrl,
            captionSuggestion: deliverableCaption,
            hashtagsSuggestion: hashtagsArr,
            notes: deliverableNotes,
            submittedAt: new Date().toISOString()
          }
        };
      }
      return p;
    });

    setProjects(updatedProjects);
    saveStoredClientProjects(updatedProjects);
    setActiveProject(null);

    setNotif(`🚀 Deliverable submitted for project "${activeProject.title}"! Client notified for review.`);
    setTimeout(() => setNotif(null), 3000);
  };

  const totalEarnings = projects
    .filter(p => p.status === 'completed')
    .reduce((acc, p) => acc + p.freelancerEarnings, 0);

  const pendingEarnings = projects
    .filter(p => p.status === 'in_progress' || p.status === 'review_requested')
    .reduce((acc, p) => acc + p.freelancerEarnings, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white rounded-2xl shadow-lg shadow-purple-500/20">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Freelancer Creator Dashboard</span>
              <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full border border-purple-500/20">
                Pro Portal
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage client orders, submit deliverables, and track net earnings after 15% platform commission
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>Client OAuth Tokens Isolated &amp; Secure</span>
        </div>
      </div>

      {notif && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notif}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Net Earnings</span>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">₹{totalEarnings.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-500 font-semibold">After 15% platform commission</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending / In Review</span>
          <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">₹{pendingEarnings.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400">Across active client projects</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Freelancer Rating</span>
          <p className="text-3xl font-extrabold text-amber-500 flex items-center gap-1">
            <Star className="w-6 h-6 fill-amber-400" />
            <span>{profile?.rating || 4.9}</span>
          </p>
          <p className="text-[11px] text-slate-400">{profile?.reviewCount || 48} verified client reviews</p>
        </div>
      </div>

      {/* Profile & Active Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (5 cols): Freelancer Profile Card */}
        <div className="lg:col-span-5 space-y-6">
          {profile && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center gap-4">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-purple-500/30"
                />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{profile.name}</h3>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">{profile.title}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/20">
                    Available for Orders
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {profile.bio}
              </p>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Active Skills &amp; Software</span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (7 cols): Active Projects & Deliverable Submission */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-500" />
              <span>Incoming &amp; Active Client Projects ({projects.length})</span>
            </h3>

            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{project.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Client: {project.clientName}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                        Net: ₹{project.freelancerEarnings.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400">Gross: ₹{project.price.toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800/80">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      project.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : project.status === 'review_requested'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    }`}>
                      {project.status === 'completed' ? '✓ Paid & Completed' : project.status === 'review_requested' ? '⏳ Under Client Review' : '🔨 In Progress'}
                    </span>

                    {project.status !== 'completed' && (
                      <button
                        onClick={() => setActiveProject(project)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Submit Deliverable</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Deliverable Submission Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Submit Deliverable for "{activeProject.title}"
              </h3>
              <button
                onClick={() => setActiveProject(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitDeliverable} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Deliverable Title
                </label>
                <input
                  type="text"
                  required
                  value={deliverableTitle}
                  onChange={(e) => setDeliverableTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Media Asset URL (Video / Image)
                </label>
                <input
                  type="text"
                  required
                  value={deliverableMediaUrl}
                  onChange={(e) => setDeliverableMediaUrl(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Suggested Caption Body
                </label>
                <textarea
                  rows={3}
                  value={deliverableCaption}
                  onChange={(e) => setDeliverableCaption(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveProject(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition-all"
                >
                  Submit Deliverable to Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
