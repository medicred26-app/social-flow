'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Star, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  Award, 
  ExternalLink, 
  Send, 
  Sparkles, 
  DollarSign,
  Layers,
  FileText
} from 'lucide-react';
import { FreelancerProfile, fetchFreelancerProfile, fetchPlatformSettings } from '@/lib/marketplace';
import { useAuth } from '@/lib/auth-context';

export default function FreelancerPublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const freelancerId = resolvedParams.id;
  const { user } = useAuth();
  const router = useRouter();

  const [freelancer, setFreelancer] = useState<FreelancerProfile | null>(null);
  const [commissionRate, setCommissionRate] = useState<number>(15);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Hire Modal State
  const [isHireModalOpen, setIsHireModalOpen] = useState<boolean>(false);
  const [jobTitle, setJobTitle] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [jobBudget, setJobBudget] = useState<number>(5000);
  const [deadlineDays, setDeadlineDays] = useState<number>(7);
  const [isSubmittingJob, setIsSubmittingJob] = useState<boolean>(false);
  const [jobSuccess, setJobSuccess] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [fl, settings] = await Promise.all([
        fetchFreelancerProfile(freelancerId),
        fetchPlatformSettings()
      ]);
      setFreelancer(fl);
      setCommissionRate(settings.commissionPercentage || 15);
      if (fl?.hourly_rate) {
        setJobBudget(fl.hourly_rate);
      }
      setIsLoading(false);
    }
    loadData();
  }, [freelancerId]);

  const handleHireSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to hire a freelancer.');
      router.push('/login');
      return;
    }

    if (!freelancer) return;

    setIsSubmittingJob(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/marketplace/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: user.id || user.email,
          clientName: user.name,
          clientEmail: user.email,
          freelancerId: freelancer.id,
          title: jobTitle,
          description: jobDescription,
          category: freelancer.categories[0] || 'Social Media',
          budget: jobBudget,
          deadlineDays
        })
      });
      const data = await res.json();
      setIsSubmittingJob(false);

      if (data.success) {
        setJobSuccess(true);
        setTimeout(() => {
          setIsHireModalOpen(false);
          setJobSuccess(false);
        }, 2000);
      } else {
        alert(data.error || 'Failed to submit job request.');
      }
    } catch (e: any) {
      setIsSubmittingJob(false);
      alert(e.message || 'Failed to connect to marketplace server.');
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-medium">Loading professional profile...</p>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Profile Not Found</h2>
        <p className="text-xs text-slate-400">The requested freelancer profile does not exist or has been removed.</p>
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Services Directory
        </Link>
      </div>
    );
  }

  const platformFee = (jobBudget * commissionRate) / 100;
  const freelancerEarns = jobBudget - platformFee;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Navigation */}
      <Link
        href="/services"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Services Marketplace
      </Link>

      {/* Header Profile Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={freelancer.user_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(freelancer.user_email)}`}
              alt={freelancer.user_name || freelancer.professional_title}
              className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-indigo-500/30 flex-shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {freelancer.user_name || freelancer.user_email.split('@')[0]}
                </h1>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  {Number(freelancer.rating_avg) > 0 ? Number(freelancer.rating_avg).toFixed(1) : 'New'}
                </span>
              </div>
              <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                {freelancer.professional_title}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                <span>{freelancer.experience_years} Years Experience</span>
                <span>•</span>
                <span className="capitalize text-emerald-500 font-semibold">{freelancer.availability_status}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsHireModalOpen(true)}
            className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Hire / Request Job</span>
          </button>
        </div>

        {/* Bio */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">About</h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {freelancer.bio}
          </p>
        </div>

        {/* Skills Tag List */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Specializations & Tools</h3>
          <div className="flex flex-wrap gap-2">
            {freelancer.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-500" /> Offered Services
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                {freelancer.categories[0] || 'Social Media Service'}
              </span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                ₹{freelancer.hourly_rate ? freelancer.hourly_rate.toLocaleString('en-IN') : '2,000'}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {freelancer.professional_title} Package
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Complete professional delivery customized for your social media accounts. Includes revisions and high-quality deliverables.
            </p>

            <button
              onClick={() => setIsHireModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs transition-colors cursor-pointer"
            >
              Order Service (₹{freelancer.hourly_rate ? freelancer.hourly_rate.toLocaleString('en-IN') : '2,000'})
            </button>
          </div>
        </div>
      </div>

      {/* Hire Job Request Modal */}
      {isHireModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-indigo-500" /> Hire {freelancer.user_name || 'Freelancer'}
              </h3>
              <button
                onClick={() => setIsHireModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {jobSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Job Request Sent!</h4>
                <p className="text-xs text-slate-400">The freelancer has received your project details.</p>
              </div>
            ) : (
              <form onSubmit={handleHireSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Create 10 Promotional Instagram Reels"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Project Requirements & Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Detail your requirements, brand guidelines, target audience, and expected deliverables..."
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Total Budget (₹) *</label>
                    <input
                      type="number"
                      required
                      min={500}
                      value={jobBudget}
                      onChange={(e) => setJobBudget(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Deadline (Days) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={60}
                      value={deadlineDays}
                      onChange={(e) => setDeadlineDays(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Financial Breakdown */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Client Total Payment:</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹{jobBudget.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>SocialFlow Fee ({commissionRate}%):</span>
                    <span>₹{platformFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-indigo-600 dark:text-indigo-400 font-bold pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span>Freelancer Payout:</span>
                    <span>₹{freelancerEarns.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingJob}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmittingJob ? 'Sending Job Request...' : 'Confirm Job Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
