'use client';

import React, { useState } from 'react';
import { Sparkles, UserCheck, Briefcase, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth, UserRole } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

interface GoogleRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GoogleRoleModal({ isOpen, onClose }: GoogleRoleModalProps) {
  const { loginWithGoogle } = useAuth();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirmGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      
      // Update stored user role to selectedRole
      const storedUserStr = localStorage.getItem('sf_auth_user');
      if (storedUserStr) {
        const storedUser = JSON.parse(storedUserStr);
        storedUser.role = selectedRole;
        localStorage.setItem('sf_auth_user', JSON.stringify(storedUser));
      }

      onClose();

      // Route based on chosen role
      if (selectedRole === 'freelancer') {
        router.push('/freelancer');
      } else {
        router.push('/dashboard');
      }
    } catch (e) {
      console.error('Google Sign-In Error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full space-y-6 shadow-2xl animate-in zoom-in-95 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Google Account Type
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            Please choose how you want to use SocialFlow before continuing with Google OAuth:
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 gap-3">
          <button
            type="button"
            onClick={() => setSelectedRole('customer')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
              selectedRole === 'customer'
                ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-300 ring-2 ring-purple-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-purple-500/50 bg-slate-50/50 dark:bg-slate-950/50 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className={`p-2.5 rounded-xl ${selectedRole === 'customer' ? 'bg-purple-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xs block text-slate-900 dark:text-white">
                Customer / Brand User
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                Manage social channels, AI content generator, publishing scheduler &amp; hire freelancers.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('freelancer')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
              selectedRole === 'freelancer'
                ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-300 ring-2 ring-purple-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-purple-500/50 bg-slate-50/50 dark:bg-slate-950/50 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className={`p-2.5 rounded-xl ${selectedRole === 'freelancer' ? 'bg-purple-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xs block text-slate-900 dark:text-white">
                Freelancer Creator
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                Browse social media jobs, deliver video/graphic work, submit proposals &amp; earn payouts.
              </p>
            </div>
          </button>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleConfirmGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:opacity-95 text-white rounded-xl py-3 px-4 text-xs font-bold shadow-lg shadow-purple-500/25 transition-all cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>{isLoading ? 'Connecting Google Account...' : `Continue with Google as ${selectedRole === 'freelancer' ? 'Freelancer' : 'Customer'}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>OAuth 2.0 SSL Encrypted Authentication</span>
        </div>
      </div>
    </div>
  );
}
