import React from 'react';
import Link from 'next/link';
import { Shield, Sparkles, Lock, FileText, ArrowLeft, Mail, CheckCircle2, Eye, Server, RefreshCw } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — SocialFlow',
  description: 'SocialFlow Privacy Policy detailing data collection, Meta Graph API usage, social account permissions, and data protection practices.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'September 7, 2026';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header Navigation */}
      <header className="h-20 border-b border-slate-800/80 px-6 lg:px-12 flex items-center justify-between bg-slate-900/60 backdrop-blur-xl sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
            SocialFlow
          </span>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 transition-all hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Hero Banner */}
      <div className="relative overflow-hidden py-16 px-6 lg:px-12 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800/50 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span>Transparency & Security First</span>
          </div>
          
          <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-white">
            Privacy Policy
          </h1>
          
          <p className="text-slate-400 text-sm lg:text-base max-w-xl mx-auto leading-relaxed">
            Your privacy is paramount. This policy outlines how SocialFlow collects, protects, uses, and respects your personal data and connected social media accounts.
          </p>

          <p className="text-xs text-slate-500 font-mono">
            Last Updated: <span className="text-slate-300">{lastUpdated}</span>
          </p>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="max-w-4xl mx-auto px-6 py-12 lg:py-16 space-y-12 text-slate-300 leading-relaxed text-sm lg:text-base">
        
        {/* Quick Highlights Summary Box */}
        <div className="p-6 lg:p-8 rounded-3xl bg-slate-900/80 border border-indigo-500/20 shadow-2xl space-y-4 relative overflow-hidden">
          <div className="flex items-center gap-3 text-indigo-400 font-bold text-lg border-b border-slate-800 pb-4">
            <Lock className="w-5 h-5" />
            <h2>At a Glance: Key Commitments</h2>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs lg:text-sm text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>No selling of data:</strong> We never sell your personal information or connected account tokens to third parties.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Meta / Facebook Compliance:</strong> Fully compliant with Meta Platform Terms and Facebook/Instagram Graph API policies.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Minimal Permissions:</strong> We only request access permissions required to publish and analyze content you authorize.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Total Control:</strong> You can disconnect your social accounts or request full data deletion at any time.</span>
            </li>
          </ul>
        </div>

        {/* Section 1: Overview */}
        <section className="space-y-4">
          <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-extrabold">1</span>
            Overview & Introduction
          </h2>
          <p>
            SocialFlow (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the multi-platform social media automation platform accessible at <Link href="https://socialflow-web-rc3q.onrender.com" className="text-indigo-400 hover:underline">https://socialflow-web-rc3q.onrender.com</Link> (production) and <code className="text-indigo-300 font-mono text-xs bg-slate-900 px-2 py-1 rounded">http://localhost:4000</code> (local development environment). This Privacy Policy explains how we collect, store, process, and protect your information when you access our platform, log in with Google, or connect third-party platforms including Meta (Facebook Pages and Instagram Business), YouTube, X (Twitter), and LinkedIn.
          </p>
        </section>

        {/* Section 2: Data We Collect */}
        <section className="space-y-4">
          <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-extrabold">2</span>
            Information We Collect
          </h2>
          <p>
            To provide automated publishing, content scheduling, AI assistance, and social media analytics, we collect the following categories of information:
          </p>
          <div className="space-y-3 pl-4 border-l-2 border-slate-800">
            <div>
              <h3 className="font-semibold text-white">A. User Account Information</h3>
              <p className="text-slate-400 text-xs lg:text-sm">
                When you sign up or log in via Google OAuth or email, we collect your name, email address, profile picture URL, and account authentication identifiers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white">B. Connected Social Media Accounts & Tokens</h3>
              <p className="text-slate-400 text-xs lg:text-sm">
                When you connect Facebook, Instagram, YouTube, LinkedIn, or X, we receive access tokens, refresh tokens, channel/page names, handles, profile pictures, follower counts, and page identifiers provided via official API authorization flows.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white">C. Content & Scheduled Posts</h3>
              <p className="text-slate-400 text-xs lg:text-sm">
                Captions, uploaded images, video assets, scheduled post dates, target platforms, and AI prompt history generated within the SocialFlow workspace.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white">D. Social Media Performance Metrics</h3>
              <p className="text-slate-400 text-xs lg:text-sm">
                Aggregated performance analytics (likes, comments, impressions, reach, engagement rates) fetched from official platform Graph APIs to display analytics dashboards.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: How We Use Information */}
        <section className="space-y-4">
          <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-extrabold">3</span>
            How We Use Your Information
          </h2>
          <p>We process collected data exclusively for authorized operational purposes:</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li>Publishing posts, Reels, Shorts, and updates to your authorized Facebook Pages, Instagram Accounts, YouTube channels, and other platforms.</li>
            <li>Enabling scheduled social media posting at optimized times.</li>
            <li>Generating AI content suggestions using our built-in AI Marketing Suite.</li>
            <li>Displaying performance metrics and growth analytics in your private dashboard.</li>
            <li>Operating our SocialFlow Services Freelancer Marketplace (connecting clients and creators).</li>
          </ul>
        </section>

        {/* Section 4: Meta Graph API & Third-Party Integration Policy */}
        <section className="space-y-4">
          <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-extrabold">4</span>
            Meta / Facebook & Third-Party Platform Policies
          </h2>
          <p>
            SocialFlow strictly adheres to the terms of service and developer rules of all connected third-party providers:
          </p>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-400" />
              Meta Platform Compliance (Facebook & Instagram)
            </h3>
            <p className="text-xs lg:text-sm text-slate-400 leading-relaxed">
              We request only permissions necessary for Page and Instagram Business functionality, such as <code className="text-indigo-300">pages_show_list</code>, <code className="text-indigo-300">pages_manage_posts</code>, <code className="text-indigo-300">instagram_business_basic</code>, and <code className="text-indigo-300">instagram_business_content_publish</code>. We do not transfer, sell, or use Meta user data for advertising, surveillance, or data broker operations.
            </p>
          </div>
        </section>

        {/* Section 5: Data Security & Storage */}
        <section className="space-y-4">
          <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-extrabold">5</span>
            Data Storage & Security Measures
          </h2>
          <p>
            Your access tokens and workspace configurations are stored securely using Supabase database infrastructure with SSL encryption during transit and encrypted token handling. Access to production databases is strictly limited to automated backend servers.
          </p>
        </section>

        {/* Section 6: Data Deletion & User Rights */}
        <section className="space-y-4">
          <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-extrabold">6</span>
            Data Deletion Instructions & User Rights
          </h2>
          <p>
            You retain full ownership and control over your data. You may disconnect connected accounts or request full deletion at any time:
          </p>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="font-semibold text-white text-sm">Disconnecting Accounts via SocialFlow</h3>
              <p className="text-xs text-slate-400 mt-1">
                Navigate to <strong>Accounts</strong> in your SocialFlow dashboard, select your connected platform, and click <strong>Disconnect</strong>. This immediately removes access tokens from our active database.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="font-semibold text-white text-sm">Revoking Permissions via Facebook / Meta Settings</h3>
              <p className="text-xs text-slate-400 mt-1">
                You can revoke SocialFlow&apos;s access at any time by visiting your <Link href="https://www.facebook.com/settings?tab=business_tools" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline">Facebook Business Integration Settings</Link> and removing SocialFlow.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="font-semibold text-white text-sm">Complete Account Data Deletion Request</h3>
              <p className="text-xs text-slate-400 mt-1">
                To request complete erasure of your SocialFlow account data, send an email to <span className="text-indigo-300 font-mono">support@socialflow-web-rc3q.onrender.com</span> or <span className="text-indigo-300 font-mono">privacy@socialflow.app</span> with the subject &quot;Data Deletion Request&quot;. Requests are processed within 48 hours.
              </p>
            </div>
          </div>
        </section>

        {/* Section 7: Contact Us */}
        <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-400" />
            Contact & Privacy Inquiries
          </h2>
          <p className="text-xs lg:text-sm text-slate-400">
            If you have questions regarding this Privacy Policy or data processing practices, contact our Privacy Officer:
          </p>
          <div className="text-xs font-mono text-indigo-300 space-y-1 pt-1">
            <p>Email: privacy@socialflow.app</p>
            <p>Support: support@socialflow-web-rc3q.onrender.com</p>
            <p>Production URL: https://socialflow-web-rc3q.onrender.com/privacy-policy</p>
            <p>Localhost URL: http://localhost:4000/privacy-policy</p>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-6 text-center text-xs text-slate-500 bg-slate-950">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} SocialFlow. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>•</span>
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
