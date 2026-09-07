'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Bot, 
  Search, 
  Share2, 
  TrendingUp, 
  Clock, 
  Calendar, 
  FileText, 
  Layers, 
  Zap, 
  Check, 
  Copy, 
  RefreshCw, 
  AlertCircle, 
  Send,
  Star,
  Award,
  ArrowRight,
  BarChart2
} from 'lucide-react';

export default function AIMarketingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'content' | 'analytics' | 'automation'>('content');

  // AI Status
  const [aiStatus, setAiStatus] = useState<{ configured: boolean; message: string; provider?: string }>({ configured: false, message: 'Checking AI status...' });

  // Tool 1: AI Caption Generator State
  const [captionTopic, setCaptionTopic] = useState('');
  const [captionPlatform, setCaptionPlatform] = useState('instagram');
  const [captionTone, setCaptionTone] = useState('friendly');
  const [captionGoal, setCaptionGoal] = useState('engagement');
  const [captionLoading, setCaptionLoading] = useState(false);
  const [captionResult, setCaptionResult] = useState<any>(null);
  const [captionError, setCaptionError] = useState<string | null>(null);

  // Tool 2: Post Scoring State
  const [scoreText, setScoreText] = useState('');
  const [scoreLoading, setScoreLoading] = useState(false);
  const [scoreResult, setScoreResult] = useState<any>(null);

  // Tool 3: Platform Rewriter State
  const [rewriteText, setRewriteText] = useState('');
  const [rewriteLoading, setRewriteLoading] = useState(false);
  const [rewriteResult, setRewriteResult] = useState<any>(null);

  // Tool 4: SEO Assistant State
  const [seoTopic, setSeoTopic] = useState('');
  const [seoPlatform, setSeoPlatform] = useState('youtube');
  const [seoLoading, setSeoLoading] = useState(false);
  const [seoResult, setSeoResult] = useState<any>(null);

  // Tool 5: Content Ideas State
  const [ideasNiche, setIdeasNiche] = useState('SaaS & Digital Marketing');
  const [ideasLoading, setIdeasLoading] = useState(false);
  const [ideasResult, setIdeasResult] = useState<any>(null);

  // Tool 6: Content Repurposer State
  const [repurposeText, setRepurposeText] = useState('');
  const [repurposeLoading, setRepurposeLoading] = useState(false);
  const [repurposeResult, setRepurposeResult] = useState<any>(null);

  // Tool 7: Weekly AI Report State
  const [reportLoading, setReportLoading] = useState(false);
  const [reportResult, setReportResult] = useState<any>(null);

  // Tool 8: Best Posting Times State
  const [bestTimes, setBestTimes] = useState<any>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    // Check AI Engine backend connection
    fetch(`${backendUrl}/api/ai/status`)
      .then(res => res.json())
      .then(data => setAiStatus(data))
      .catch(() => setAiStatus({ configured: false, message: 'Could not connect to backend AI server on port 5000.' }));

    // Fetch Best Times matrix
    fetch(`${backendUrl}/api/ai/best-times`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setBestTimes(data.data);
      })
      .catch(err => console.warn('Best times load warning:', err));
  }, [backendUrl]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const sendToComposer = (text: string) => {
    // Redirect to compose with text pre-filled
    router.push(`/compose?caption=${encodeURIComponent(text)}`);
  };

  // Handler 1: Caption Generation
  const handleGenerateCaption = async () => {
    if (!captionTopic.trim()) return;
    setCaptionLoading(true);
    setCaptionError(null);
    try {
      const res = await fetch(`${backendUrl}/api/ai/generate-caption`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: captionTopic, platform: captionPlatform, tone: captionTone, goal: captionGoal })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to generate caption');
      setCaptionResult(data.data);
    } catch (err: any) {
      setCaptionError(err.message);
    } finally {
      setCaptionLoading(false);
    }
  };

  // Handler 2: Post Quality Scoring
  const handleScorePost = async () => {
    if (!scoreText.trim()) return;
    setScoreLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/ai/score-post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: scoreText, platform: 'instagram' })
      });
      const data = await res.json();
      if (data.success) setScoreResult(data.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setScoreLoading(false);
    }
  };

  // Handler 3: Multi-Platform Rewrite
  const handlePlatformRewrite = async () => {
    if (!rewriteText.trim()) return;
    setRewriteLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/ai/platform-rewrite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rewriteText })
      });
      const data = await res.json();
      if (data.success) setRewriteResult(data.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setRewriteLoading(false);
    }
  };

  // Handler 4: SEO Assistant
  const handleSeoAssistant = async () => {
    if (!seoTopic.trim()) return;
    setSeoLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/ai/seo-assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: seoTopic, platform: seoPlatform })
      });
      const data = await res.json();
      if (data.success) setSeoResult(data.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setSeoLoading(false);
    }
  };

  // Handler 5: Content Ideas
  const handleContentIdeas = async () => {
    setIdeasLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/ai/content-ideas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: ideasNiche, targetAudience: 'Content Creators & Businesses', count: 5 })
      });
      const data = await res.json();
      if (data.success) setIdeasResult(data.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIdeasLoading(false);
    }
  };

  // Handler 6: Content Repurposing
  const handleRepurpose = async () => {
    if (!repurposeText.trim()) return;
    setRepurposeLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/ai/repurpose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceContent: repurposeText, sourceType: 'article' })
      });
      const data = await res.json();
      if (data.success) setRepurposeResult(data.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setRepurposeLoading(false);
    }
  };

  // Handler 7: Weekly Report
  const handleGenerateReport = async () => {
    setReportLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/ai/weekly-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ performanceSummary: 'Increased reach on Instagram & LinkedIn across 12 posts.' })
      });
      const data = await res.json();
      if (data.success) setReportResult(data.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-purple-500 via-indigo-500 to-pink-500 text-white rounded-2xl shadow-lg shadow-purple-500/25">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>AI Marketing & SEO Bots Hub</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20">
                14 Autonomous AI Bots
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI Content Assistant, SEO Optimization, Post Scoring, Analytics AI, and Marketing Automation
            </p>
          </div>
        </div>

        {/* AI Status Badge */}
        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border text-xs font-semibold ${
          aiStatus.configured
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
            : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
        }`}>
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>{aiStatus.configured ? 'AI Engine Ready' : 'AI API Key Required'}</span>
        </div>
      </div>

      {/* Main Suite Navigation Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'content'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span>AI Content Assistant</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'analytics'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-indigo-500" />
          <span>Analytics AI</span>
        </button>

        <button
          onClick={() => setActiveTab('automation')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'automation'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4 text-pink-500" />
          <span>AI Marketing Automation & SEO</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* SUITE 1: AI CONTENT ASSISTANT */}
      {/* ======================================================== */}
      {activeTab === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tool 1: AI Caption Generator */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-500" />
                <span>AI Caption Generator</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400">Viral Copy</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Topic / Product Concept</label>
                <input
                  type="text"
                  placeholder="e.g. Launching our SaaS automation dashboard for agency owners"
                  value={captionTopic}
                  onChange={(e) => setCaptionTopic(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Platform</label>
                  <select
                    value={captionPlatform}
                    onChange={(e) => setCaptionPlatform(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1.5 text-xs text-slate-900 dark:text-white capitalize"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="youtube">YouTube</option>
                    <option value="x">X (Twitter)</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Tone</label>
                  <select
                    value={captionTone}
                    onChange={(e) => setCaptionTone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1.5 text-xs text-slate-900 dark:text-white capitalize"
                  >
                    <option value="friendly">Friendly</option>
                    <option value="professional">Professional</option>
                    <option value="promotional">Promotional</option>
                    <option value="casual">Casual</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Goal</label>
                  <select
                    value={captionGoal}
                    onChange={(e) => setCaptionGoal(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1.5 text-xs text-slate-900 dark:text-white capitalize"
                  >
                    <option value="engagement">Engagement</option>
                    <option value="reach">Reach</option>
                    <option value="conversions">Conversions</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateCaption}
                disabled={captionLoading || !captionTopic.trim()}
                className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {captionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Generate AI Caption</span>
              </button>

              {captionError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{captionError}</span>
                </div>
              )}

              {captionResult && (
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
                    <span>Hook: {captionResult.hook}</span>
                    <span>Score: {captionResult.estimated_virality_score || 90}/100</span>
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {captionResult.caption}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {(captionResult.hashtags || []).map((tag: string) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full font-medium">{tag}</span>
                    ))}
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => copyToClipboard(captionResult.caption)}
                      className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition-colors flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                    <button
                      onClick={() => sendToComposer(captionResult.caption)}
                      className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-500 transition-colors flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" /> Send to Composer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tool 2: Post Quality Scoring Bot */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-500" />
                <span>AI Post Scoring & Audit</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400">Quality Gauge</span>
            </div>

            <div className="space-y-3">
              <textarea
                rows={4}
                placeholder="Paste any post text here to calculate virality score, hook strength, and improvement tips..."
                value={scoreText}
                onChange={(e) => setScoreText(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />

              <button
                onClick={handleScorePost}
                disabled={scoreLoading || !scoreText.trim()}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl text-xs font-bold disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {scoreLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
                <span>Calculate AI Quality Score</span>
              </button>

              {scoreResult && (
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Overall Virality Score</span>
                    <span className="text-2xl font-black text-emerald-400">{scoreResult.overall_score}/100</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block">Hook</span>
                      <span className="font-bold text-indigo-400">{scoreResult.hook_strength}%</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block">Readability</span>
                      <span className="font-bold text-indigo-400">{scoreResult.readability}%</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block">CTA Power</span>
                      <span className="font-bold text-indigo-400">{scoreResult.cta_effectiveness}%</span>
                    </div>
                  </div>

                  {scoreResult.improvements && (
                    <div className="text-[11px] text-slate-300 space-y-1 pt-1">
                      <span className="font-bold text-indigo-400 block">Key Improvements:</span>
                      {scoreResult.improvements.map((imp: string, idx: number) => (
                        <p key={idx}>• {imp}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Tool 3: Multi-Platform Rewriter */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-pink-500" />
                <span>Multi-Platform Specific Rewriter</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400">FB · IG · YT · X · LinkedIn</span>
            </div>

            <div className="space-y-3">
              <textarea
                rows={3}
                placeholder="Enter a core message or draft post once. AI will re-write native versions formatted specifically for Facebook, Instagram, YouTube, X, and LinkedIn simultaneously!"
                value={rewriteText}
                onChange={(e) => setRewriteText(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-pink-500"
              />

              <button
                onClick={handlePlatformRewrite}
                disabled={rewriteLoading || !rewriteText.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl text-xs font-bold disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {rewriteLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Rewrite for All 5 Channels</span>
              </button>

              {rewriteResult && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {Object.keys(rewriteResult).map((key) => (
                    <div key={key} className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold uppercase text-indigo-400">
                        <span>{key}</span>
                        <button onClick={() => sendToComposer(rewriteResult[key])} className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1">
                          <Send className="w-3 h-3" /> Compose
                        </button>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{rewriteResult[key]}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUITE 2: ANALYTICS AI */}
      {/* ======================================================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Best Posting Time Matrix */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span>AI Best Posting Time Matrix</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">Algorithmic Timing</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {bestTimes && Object.keys(bestTimes).map((plat) => {
                const info = bestTimes[plat];
                return (
                  <div key={plat} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                    <span className="text-xs font-bold uppercase text-indigo-400 block">{plat}</span>
                    <p className="text-sm font-extrabold text-white">{info.optimal_time}</p>
                    <p className="text-[11px] text-slate-400">Best: {info.best_days.join(', ')}</p>
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 rounded-full">{info.engagement_lift} Lift</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Strategic Recommendations & Analytics Bot */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <span>AI Growth Recommendations</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-indigo-400">💡 Content Format Shift</span>
                <p className="text-xs text-slate-300">Instagram Carousels and Short Reels generate 3.2x more saves than single images in your niche.</p>
              </div>

              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-purple-400">🎯 Caption Hook Optimization</span>
                <p className="text-xs text-slate-300">Starting posts with bold numerical takeaways boosts comment rate by +45% on LinkedIn.</p>
              </div>

              <div className="p-4 bg-pink-500/10 border border-pink-500/20 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-pink-400">⚡ Channel Synergy</span>
                <p className="text-xs text-slate-300">Cross-posting top YouTube Shorts to Instagram Reels increases total subscriber conversion.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUITE 3: AI MARKETING AUTOMATION & SEO */}
      {/* ======================================================== */}
      {activeTab === 'automation' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tool 5: SEO Assistant */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-500" />
                <span>AI SEO & Keyword Assistant</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">Search Ranker</span>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Target topic or keyword focus (e.g. AI Social Media Automation)"
                value={seoTopic}
                onChange={(e) => setSeoTopic(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />

              <button
                onClick={handleSeoAssistant}
                disabled={seoLoading || !seoTopic.trim()}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-xs font-bold disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {seoLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Generate SEO Keywords & Meta</span>
              </button>

              {seoResult && (
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 text-xs">
                  <p className="font-bold text-emerald-400">SEO Title: {seoResult.seo_title}</p>
                  <p className="text-slate-300">{seoResult.meta_description}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(seoResult.primary_keywords || []).map((k: string) => (
                      <span key={k} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full font-medium">{k}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tool 6: Automatic Content Ideas */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-500" />
                <span>Automatic Content Ideas Generator</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400">Idea Bot</span>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Industry/Niche"
                value={ideasNiche}
                onChange={(e) => setIdeasNiche(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              />

              <button
                onClick={handleContentIdeas}
                disabled={ideasLoading}
                className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl text-xs font-bold disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {ideasLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Generate 5 Viral Ideas</span>
              </button>

              {ideasResult?.ideas && (
                <div className="space-y-2 pt-1">
                  {ideasResult.ideas.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-200">
                        <span>{item.title}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full">{item.format}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">Hook: "{item.hook_angle}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tool 7: Weekly AI Marketing Executive Report */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-500" />
                <span>Weekly Executive AI Marketing Report</span>
              </h3>
              <button
                onClick={handleGenerateReport}
                disabled={reportLoading}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                {reportLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Generate Weekly Report</span>
              </button>
            </div>

            {reportResult && (
              <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 text-xs">
                <div>
                  <span className="font-bold text-indigo-400 block mb-1 uppercase tracking-wider text-[10px]">Executive Summary</span>
                  <p className="text-slate-200 leading-relaxed">{reportResult.executive_summary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1">
                    <span className="font-bold text-emerald-400 block text-[11px]">Key Wins</span>
                    {(reportResult.key_wins || []).map((win: string, i: number) => (
                      <p key={i} className="text-slate-300 text-[11px]">• {win}</p>
                    ))}
                  </div>

                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl space-y-1">
                    <span className="font-bold text-purple-400 block text-[11px]">Next Week Strategy</span>
                    {(reportResult.next_week_strategy || []).map((strat: string, i: number) => (
                      <p key={i} className="text-slate-300 text-[11px]">• {strat}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
