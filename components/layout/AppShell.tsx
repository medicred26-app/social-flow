'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '@/components/ui/Sidebar';
import { Navbar } from '@/components/ui/Navbar';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { useAuth } from '@/lib/auth-context';
import { Lock, LogIn, Sparkles, ShieldAlert, ArrowRight, UserCheck, Briefcase } from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, login } = useAuth();

  const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname === '/privacy-policy' || pathname === '/terms';

  // Public Landing Page, Login, or Signup
  if (isPublicPage) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200" suppressHydrationWarning>
        <CustomCursor />
        {children}
      </div>
    );
  }

  // Protected App Pages — require authentication
  if (!user && !isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <CustomCursor />
        
        {/* Simple Public Header */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-600 dark:from-white dark:via-indigo-100 dark:to-indigo-300 bg-clip-text text-transparent">
              SocialFlow
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold rounded-xl shadow-md hover:opacity-95 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </header>

        {/* Protected Route Auth Guard Notice */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-lg w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6 relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Authentication Required
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                You must be signed in to access your SocialFlow workspace.
              </p>
            </div>

            {/* Demo Access — Two Roles */}
            <div className="pt-2 space-y-3">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Demo Access</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={async () => {
                    await login('demo@socialflow.app', 'demo123', 'customer');
                    router.push('/dashboard');
                  }}
                  className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800/40 rounded-2xl hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                    <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Customer</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Create & publish content</span>
                </button>

                <button
                  onClick={async () => {
                    await login('freelancer@socialflow.app', 'demo123', 'freelancer');
                    router.push('/freelancer');
                  }}
                  className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl hover:border-emerald-400 dark:hover:border-emerald-600 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                    <Briefcase className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Freelancer</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Offer services & earn</span>
                </button>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
                <Link
                  href="/login"
                  className="w-full py-2.5 px-4 text-xs font-semibold border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors block text-center"
                >
                  Sign In with Email / Google
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Authenticated User Workspace
  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200" suppressHydrationWarning>
      <CustomCursor />
      {/* Main Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen custom-scrollbar overflow-y-auto">
        <Navbar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
