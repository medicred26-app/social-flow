'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  UserPlus, 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  ArrowLeft,
  DollarSign,
  Award,
  Layers,
  FileText
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { 
  Category, 
  FreelancerProfile, 
  fetchMarketplaceCategories, 
  fetchMyFreelancerProfile, 
  applyAsFreelancer 
} from '@/lib/marketplace';

export default function BecomeFreelancerPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [myProfile, setMyProfile] = useState<FreelancerProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Form State
  const [professionalTitle, setProfessionalTitle] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [skillsInput, setSkillsInput] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [experienceYears, setExperienceYears] = useState<number>(2);
  const [hourlyRate, setHourlyRate] = useState<number>(2000);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const cats = await fetchMarketplaceCategories();
      setCategories(cats);

      if (user?.id || user?.email) {
        const existing = await fetchMyFreelancerProfile(user.id || user.email);
        if (existing) {
          setMyProfile(existing);
          setProfessionalTitle(existing.professional_title);
          setBio(existing.bio);
          setSkillsInput(existing.skills ? existing.skills.join(', ') : '');
          setSelectedCategories(existing.categories || []);
          setExperienceYears(existing.experience_years || 1);
          setHourlyRate(existing.hourly_rate || 2000);
        }
      }
      setIsLoading(false);
    }
    loadData();
  }, [user]);

  const toggleCategory = (slug: string) => {
    if (selectedCategories.includes(slug)) {
      setSelectedCategories(selectedCategories.filter(c => c !== slug));
    } else {
      setSelectedCategories([...selectedCategories, slug]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!user) {
      setErrorMessage('You must be logged into SocialFlow to apply as a freelancer.');
      return;
    }

    if (!professionalTitle.trim()) {
      setErrorMessage('Please enter your professional title.');
      return;
    }

    if (bio.trim().length < 30) {
      setErrorMessage('Please write a detailed bio (at least 30 characters).');
      return;
    }

    if (selectedCategories.length === 0) {
      setErrorMessage('Please select at least one service category.');
      return;
    }

    setIsSubmitting(true);

    const skills = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const res = await applyAsFreelancer({
      userId: user.id || user.email,
      userEmail: user.email,
      userName: user.name,
      userAvatar: user.avatar,
      professionalTitle,
      bio,
      skills,
      categories: selectedCategories,
      experienceYears,
      hourlyRate
    });

    setIsSubmitting(false);

    if (res.success && res.profile) {
      setMyProfile(res.profile);
      setSuccessMessage('Application submitted successfully! Your profile is currently under admin verification.');
    } else {
      setErrorMessage(res.error || 'Failed to submit application.');
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-medium">Checking freelancer status...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Back Button */}
      <Link
        href="/services"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Services Marketplace
      </Link>

      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/20 p-8 overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            SocialFlow Professional Partner Program
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Apply as a SocialFlow Freelancer
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
            Offer your social media, video editing, design, or marketing skills to thousands of SocialFlow clients. Earn money with transparent 15% platform commissions.
          </p>
        </div>
      </div>

      {/* Existing Profile Status Card */}
      {myProfile && (
        <div className={`p-6 rounded-3xl border flex items-start gap-4 ${
          myProfile.verification_status === 'approved'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-100'
            : myProfile.verification_status === 'pending_review'
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-100'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-100'
        }`}>
          <div className="p-2.5 rounded-2xl bg-white/20 flex-shrink-0">
            {myProfile.verification_status === 'approved' ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            ) : myProfile.verification_status === 'pending_review' ? (
              <Clock className="w-6 h-6 text-amber-500 animate-pulse" />
            ) : (
              <AlertCircle className="w-6 h-6 text-rose-500" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold capitalize">
              Application Status: {myProfile.verification_status.replace('_', ' ')}
            </h3>
            <p className="text-xs opacity-90 leading-relaxed">
              {myProfile.verification_status === 'approved'
                ? 'Congratulations! Your profile is verified and active in the public marketplace.'
                : myProfile.verification_status === 'pending_review'
                ? 'Your profile application is currently under admin review. Once approved, your profile will appear live in the public directory.'
                : `Your profile application was rejected or suspended. Reason: ${myProfile.rejection_reason || 'Does not meet criteria'}`}
            </p>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Application Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-500" /> Professional Details
        </h2>

        {/* User Badge */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.email || 'user')}`}
            alt={user?.name || 'User'}
            className="w-10 h-10 rounded-xl object-cover border border-indigo-500/30"
          />
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.name || 'SocialFlow User'}</p>
            <p className="text-[11px] text-slate-400">{user?.email}</p>
          </div>
        </div>

        {/* Professional Title */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Professional Title *
          </label>
          <input
            type="text"
            required
            value={professionalTitle}
            onChange={(e) => setProfessionalTitle(e.target.value)}
            placeholder="e.g. Senior Video Editor & Instagram Reels Creator"
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Categories Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Select Your Categories * (Select all that apply)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {categories.map((cat) => {
              const isSelected = selectedCategories.includes(cat.slug);
              return (
                <button
                  type="button"
                  key={cat.slug}
                  onClick={() => toggleCategory(cat.slug)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500/40'
                  }`}
                >
                  <span>{cat.name}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Professional Bio & Portfolio Overview *
          </label>
          <textarea
            required
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Describe your background, past social media clients, software skills, and work process..."
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Skills Tag Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Key Skills (Comma separated)
          </label>
          <input
            type="text"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="e.g. Premiere Pro, After Effects, CapCut, Motion Graphics, Thumbnail Design"
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Rate & Experience Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Years of Experience
            </label>
            <input
              type="number"
              min={1}
              max={30}
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Starting Service Price / Rate (₹)
            </label>
            <input
              type="number"
              min={500}
              step={500}
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Platform Policy Notice */}
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-700 dark:text-indigo-300 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-500" /> Platform Terms & Verification
          </p>
          <p className="leading-relaxed opacity-90">
            SocialFlow enforces verification for all freelancers to guarantee client quality. Once submitted, your profile will be reviewed by an admin. Platform commission is fixed at 15% for completed projects.
          </p>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Submitting Application...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>{myProfile ? 'Update Freelancer Profile' : 'Submit Application for Review'}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
