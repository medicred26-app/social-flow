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
import { FreelancerProfile, fetchApprovedFreelancers, createJobRequest } from '@/lib/marketplace';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function ServicesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [freelancers, setFreelancers] = useState<FreelancerProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hireModalFreelancer, setHireModalFreelancer] = useState<FreelancerProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Hire Project Form State
  const [projectTitle, setProjectTitle] = useState('Custom Social Media Project');
  const [projectDesc, setProjectDesc] = useState('Please describe your project requirements...');
  const [projectBudget, setProjectBudget] = useState<number>(5000);
  const [notif, setNotif] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const data = await fetchApprovedFreelancers();
      setFreelancers(data);
      setIsLoading(false);
    }
    load();

    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const cat = urlParams.get('category');
      if (cat) setSelectedCategory(cat);

      const hireContext = sessionStorage.getItem('socialflow_hire_context');
      if (hireContext) {
        try {
          const parsed = JSON.parse(hireContext);
          if (parsed.title) setProjectTitle(`Improve: ${parsed.title}`);
        } catch (e) {}
      }
    }
  }, []);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hireModalFreelancer) return;

    if (!user) {
      alert('Please log in to hire a freelancer.');
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    const result = await createJobRequest({
      clientId: user.id || user.email,
      clientName: user.name,
      clientEmail: user.email,
      freelancerId: hireModalFreelancer.id,
      title: projectTitle,
      description: projectDesc,
      category: hireModalFreelancer.categories[0] || 'General',
      budget: projectBudget,
      deadlineDays: 7
    });
    setIsSubmitting(false);

    if (result.success) {
      setHireModalFreelancer(null);
      setNotif(`🚀 Job request sent to ${hireModalFreelancer.user_name || hireModalFreelancer.professional_title}! Redirecting to your projects...`);
      setTimeout(() => {
        setNotif(null);
        router.push('/projects');
      }, 1800);
    } else {
      alert(result.error || 'Failed to create job request.');
    }
  };

  const CATEGORIES: { id: string; label: string }[] = [
    { id: 'all', label: 'All Services' },
    { id: 'Video Editing', label: '✂️ Video Editors' },
    { id: 'Thumbnail Design', label: '🖼️ Thumbnail Designers' },
    { id: 'Graphic Design', label: '🎨 Graphic Designers' },
    { id: 'SEO', label: '📈 SEO Specialists' },
    { id: 'Social Media Management', label: '📱 Social Media Managers' },
    { id: 'Motion Graphics', label: '🎬 Motion Graphics' }
  ];

  const filteredFreelancers = freelancers.filter(f => {
    const matchesCategory = selectedCategory === 'all' || f.categories.includes(selectedCategory);
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      (f.user_name || '').toLowerCase().includes(q) ||
      f.professional_title.toLowerCase().includes(q) ||
      f.bio.toLowerCase().includes(q) ||
      f.skills.some(s => s.toLowerCase().includes(q));
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
      {isLoading ? (
        <div className="py-16 text-center text-xs text-slate-400 col-span-3">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading freelancers...
        </div>
      ) : filteredFreelancers.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 col-span-3">
          <Briefcase className="w-12 h-12 text-slate-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No freelancers found</p>
          <p className="text-xs text-slate-400">Try adjusting your search or category filter. New freelancers are added regularly.</p>
        </div>
      ) : null}
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
                    src={freelancer.user_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(freelancer.user_email)}`}
                    alt={freelancer.user_name || freelancer.professional_title}
                    className="w-12 h-12 rounded-2xl object-cover border border-purple-500/30"
                  />
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
                      {freelancer.user_name || freelancer.user_email.split('@')[0]}
                    </h3>
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                      {freelancer.professional_title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-xl text-xs font-bold flex-shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{Number(freelancer.rating_avg) > 0 ? Number(freelancer.rating_avg).toFixed(1) : 'New'}</span>
                </div>
              </div>

              {/* Bio */}
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {freelancer.bio}
                </p>
              </div>

              {/* Skills Badges */}
              <div className="flex flex-wrap gap-1.5">
                {(freelancer.skills || []).slice(0, 5).map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold rounded-lg">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-3 text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  {freelancer.completed_jobs_count || 0} jobs done
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {freelancer.experience_years}yr exp
                </span>
                <span className={`capitalize font-semibold ${freelancer.availability_status === 'available' ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {freelancer.availability_status}
                </span>
              </div>
            </div>

            {/* Price Footer & Hire Action */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Starting at</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">
                  ₹{(freelancer.hourly_rate || 0).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('socialflow_open_chat', {
                      detail: {
                        participant: {
                          id: freelancer.user_id || freelancer.id,
                          name: freelancer.user_name || freelancer.professional_title,
                          avatar: freelancer.user_avatar
                        }
                      }
                    }));
                  }}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  title="Message Freelancer"
                >
                  Message
                </button>

                <Link
                  href={`/services/freelancer/${freelancer.id}`}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/25 transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>View & Hire</span>
                </Link>
              </div>
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
                  src={hireModalFreelancer.user_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${hireModalFreelancer.user_email}`}
                  alt={hireModalFreelancer.user_name || hireModalFreelancer.professional_title}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Hire {hireModalFreelancer.user_name || hireModalFreelancer.professional_title}
                  </h3>
                  <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                    {hireModalFreelancer.professional_title}
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
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Project Brief &amp; Requirements</label>
                <textarea
                  rows={4}
                  required
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Budget (₹)</label>
                <input
                  type="number"
                  required
                  min={500}
                  value={projectBudget}
                  onChange={(e) => setProjectBudget(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Pricing Breakdown */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Project Price:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹{projectBudget.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>SocialFlow Platform Fee (15%):</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    ₹{Math.round(projectBudget * 0.15).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                  <span>Freelancer Net Earnings:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{Math.round(projectBudget * 0.85).toLocaleString('en-IN')}
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
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/25 hover:opacity-95 transition-all disabled:opacity-60"
                >
                  {isSubmitting ? 'Sending Request...' : 'Submit Order & Start Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
