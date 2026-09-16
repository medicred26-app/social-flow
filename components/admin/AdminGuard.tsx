'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  LogIn, 
  AlertTriangle, 
  ArrowLeft, 
  Zap, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { isAuthorizedAdmin, ALLOWED_ADMIN_EMAILS } from '@/lib/admin';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, isLoading, loginWithGoogle, logout } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleAdminGoogleLogin = async () => {
    setAuthError(null);
    setIsSigningIn(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setAuthError(err?.message || 'Google Sign-In failed. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl shadow-indigo-500/30 animate-pulse">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-slate-900 rounded-full border-2 border-slate-950 flex items-center justify-center">
            <RefreshCw className="w-3 h-3 text-indigo-400 animate-spin" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white tracking-wide">Verifying Admin Credentials...</h3>
          <p className="text-xs text-slate-400">Enforcing Google OAuth access control policy</p>
        </div>
      </div>
    );
  }

  // 2. Authorized Admin Access Granted
  if (isAuthorizedAdmin(user)) {
    return <>{children}</>;
  }

  // 3. Access Denied / Admin Login Gate Screen
  const isWrongEmailOrProvider = !!user;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background Glow Highlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Workspace Dashboard
        </Link>

        {/* Card Container */}
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-950 space-y-6">
          {/* Header Icon & Title */}
          <div className="text-center space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/30 text-indigo-400 shadow-inner">
              <ShieldAlert className="w-10 h-10 text-indigo-400" />
            </div>
            
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-bold uppercase tracking-wider">
                <Lock className="w-3 h-3" /> Protected Admin Portal
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Admin Authentication Required
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
                This section is restricted strictly to authorized platform administrators authenticated via Google.
              </p>
            </div>
          </div>

          {/* Alert if current user is logged in with unauthorized account */}
          {isWrongEmailOrProvider && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-400">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>Unauthorized Account Signed In</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                You are currently signed in as <strong className="text-white">{user.email}</strong> via <strong className="text-white">{user.provider || 'email/password'}</strong>. This account does not have administrator privileges.
              </p>
              <button
                onClick={logout}
                className="text-[11px] font-bold text-amber-400 hover:underline cursor-pointer pt-1 block"
              >
                ← Sign out of current account to switch
              </button>
            </div>
          )}

          {/* Auth Error Banner */}
          {authError && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* Allowed Admin Emails List Badge */}
          <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800/80 space-y-2">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Authorized Admin Google Accounts</span>
              <span className="text-[10px] text-emerald-400 font-medium">Verified list</span>
            </h4>
            <div className="space-y-1.5 pt-1">
              {ALLOWED_ADMIN_EMAILS.map((email) => (
                <div key={email} className="flex items-center justify-between text-xs font-mono bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800 text-indigo-300">
                  <span className="truncate">{email}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 ml-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Google Sign-in Action Button */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleAdminGoogleLogin}
              disabled={isSigningIn}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 border border-indigo-400/30 flex items-center justify-center gap-3 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {isSigningIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Connecting to Google OAuth...</span>
                </>
              ) : (
                <>
                  {/* Google SVG Logo */}
                  <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Sign In with Google (Admin Portal)</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-slate-500 leading-relaxed">
              Google OAuth popup window will request authorization for your email address. Only the two configured admin accounts will be granted entry.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-2">
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          <span>SocialFlow Security Infrastructure • Google OAuth 2.0 Policy Enforced</span>
        </div>
      </div>
    </div>
  );
}
