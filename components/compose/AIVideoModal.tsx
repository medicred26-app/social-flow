'use client';

import React, { useState, useEffect } from 'react';
import { 
  Wand2, 
  X, 
  Check, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Volume2, 
  Music, 
  Sliders, 
  Play, 
  Sparkles, 
  Layers, 
  Film, 
  ArrowRight,
  Bookmark
} from 'lucide-react';
import { VideoScriptScene, AIVideoCreationRequest, BrandKit } from '@/types';
import { getStoredBrandKit } from '@/lib/store';

interface AIVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyVideo: (videoUrl: string, caption: string, hashtags: string[], title: string) => void;
}

export function AIVideoModal({ isOpen, onClose, onApplyVideo }: AIVideoModalProps) {
  const [step, setStep] = useState<'prompt' | 'script' | 'preview'>('prompt');
  const [brandKit, setBrandKit] = useState<BrandKit | null>(null);

  // Form Inputs
  const [topic, setTopic] = useState('How AI Automation Supercharges Social Media Growth in 2026');
  const [targetAudience, setTargetAudience] = useState('Founders, Marketers & Content Creators');
  const [language, setLanguage] = useState('English (US)');
  const [tone, setTone] = useState('Energetic & Direct');
  const [videoLengthSeconds, setVideoLengthSeconds] = useState(15);
  const [keyPoints, setKeyPoints] = useState('1-click multi-channel publishing, automated captioning, zero manual editing');
  const [voiceOver, setVoiceOver] = useState('Natural Male - Energetic');
  const [backgroundMusic, setBackgroundMusic] = useState('Cinematic Lo-Fi Beat');
  const [musicVolume, setMusicVolume] = useState(30);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1'>('9:16');

  // Script & Scenes State
  const [scenes, setScenes] = useState<VideoScriptScene[]>([]);
  const [videoTitle, setVideoTitle] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [renderedVideoUrl, setRenderedVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const kit = getStoredBrandKit();
      setBrandKit(kit);
      if (kit) {
        setTargetAudience(kit.targetAudience);
        setTone(kit.brandVoice);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGenerateScript = () => {
    if (!topic.trim()) return;
    setIsGeneratingScript(true);

    setTimeout(() => {
      setIsGeneratingScript(false);
      setVideoTitle(topic.slice(0, 40));
      setScenes([
        {
          sceneNumber: 1,
          durationSeconds: 4,
          narration: 'Stop spending hours editing videos manually for 5 different platforms!',
          onScreenText: '⚡ STOP MANUAL EDITING',
          visualDescription: 'Fast motion split-screen showing automated social queue dashboard with dynamic particle effects.',
        },
        {
          sceneNumber: 2,
          durationSeconds: 5,
          narration: 'With SocialFlow, generate scripts, auto-captions, and 9:16 Reels in 1 click.',
          onScreenText: '✨ 1-CLICK AI REELS GENERATOR',
          visualDescription: 'Close up UI snippet of AI Video Engine output rendering vertical 9:16 reel.',
        },
        {
          sceneNumber: 3,
          durationSeconds: 6,
          narration: 'Schedule across Instagram, YouTube, X, and LinkedIn simultaneously. Comment AUTOMATE to test!',
          onScreenText: '🚀 PUBLISH EVERYWHERE INSTANTLY',
          visualDescription: 'Social channel icons glowing with checkmarks and real-time impression counter rising.',
        },
      ]);
      setStep('script');
    }, 1500);
  };

  const handleRegenerateScript = () => {
    setIsGeneratingScript(true);
    setTimeout(() => {
      setIsGeneratingScript(false);
      setScenes([
        {
          sceneNumber: 1,
          durationSeconds: 5,
          narration: 'What if you could run your entire social media strategy on autopilot?',
          onScreenText: '🤖 SOCIAL MEDIA ON AUTOPILOT',
          visualDescription: 'Futuristic digital workflow diagram showing content turning into 5 social formats.',
        },
        {
          sceneNumber: 2,
          durationSeconds: 5,
          narration: 'SocialFlow generates viral hooks, subtitles, and thumbnails automatically.',
          onScreenText: '🔥 VIRAL HOOKS & SUBTITLES',
          visualDescription: 'High-contrast typography popping on-screen with sound effect pulses.',
        },
        {
          sceneNumber: 3,
          durationSeconds: 5,
          narration: 'Save 10+ hours every week while scaling reach across all connected accounts.',
          onScreenText: '📈 SAVE 10+ HOURS WEEKLY',
          visualDescription: 'Growth analytics line chart scaling rapidly upwards with celebration badges.',
        },
      ]);
    }, 1200);
  };

  const handleShortenScript = () => {
    setScenes((prev) =>
      prev.map((s) => ({
        ...s,
        durationSeconds: Math.max(3, s.durationSeconds - 1),
        narration: s.narration.split('. ')[0],
      }))
    );
  };

  const handleSceneChange = (index: number, field: keyof VideoScriptScene, value: any) => {
    const updated = [...scenes];
    updated[index] = { ...updated[index], [field]: value };
    setScenes(updated);
  };

  const handleAddScene = () => {
    const newNum = scenes.length + 1;
    setScenes([
      ...scenes,
      {
        sceneNumber: newNum,
        durationSeconds: 4,
        narration: 'Add custom call to action or extra product highlight here...',
        onScreenText: `SCENE ${newNum} HIGHLIGHT`,
        visualDescription: 'Visual camera transition with brand logo overlay.',
      },
    ]);
  };

  const handleDeleteScene = (index: number) => {
    const updated = scenes.filter((_, i) => i !== index).map((s, idx) => ({ ...s, sceneNumber: idx + 1 }));
    setScenes(updated);
  };

  const handleRenderFinalVideo = () => {
    setIsGeneratingVideo(true);
    setTimeout(() => {
      setIsGeneratingVideo(false);
      const url =
        aspectRatio === '9:16'
          ? 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=80';
      setRenderedVideoUrl(url);
      setStep('preview');
    }, 2000);
  };

  const handleFinalConfirm = () => {
    const combinedCaption = scenes.map((s) => s.narration).join(' ');
    const hashtags = ['#SocialFlow', '#AIVideo', '#ContentCreation', '#ReelsViral'];
    onApplyVideo(
      renderedVideoUrl || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
      `🚀 ${combinedCaption}\n\n${brandKit?.preferredCTA || 'Comment AUTOMATE below to test!'}`,
      hashtags,
      videoTitle || topic
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-3xl w-full space-y-6 shadow-2xl animate-in zoom-in-95 my-8">
        {/* Header & Step Indicator */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white rounded-2xl shadow-lg shadow-indigo-500/20">
              <Wand2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>AI Video &amp; Script Creation Engine</span>
                {brandKit && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-bold">
                    Brand Kit Active
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                PDF Workflow: Prompt → Generate Script → Edit Scenes → Storyboard → Publish
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
          <button
            onClick={() => setStep('prompt')}
            className={`flex-1 py-2 rounded-xl text-center transition-all ${
              step === 'prompt'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            1. Concept &amp; Settings
          </button>
          <button
            onClick={() => step !== 'prompt' && setStep('script')}
            className={`flex-1 py-2 rounded-xl text-center transition-all ${
              step === 'script'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            2. Scene-by-Scene Script
          </button>
          <button
            onClick={() => step === 'preview' && setStep('preview')}
            className={`flex-1 py-2 rounded-xl text-center transition-all ${
              step === 'preview'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            3. Storyboard &amp; Preview
          </button>
        </div>

        {/* STEP 1: PROMPT & INPUTS */}
        {step === 'prompt' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Video Topic / Prompt *
              </label>
              <textarea
                rows={3}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Describe what your short video should be about..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Tone of Voice
                </label>
                <input
                  type="text"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="English (US)">English (US)</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>
            </div>

            {/* Controls Row: Aspect Ratio & Audio */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Aspect Ratio
                </label>
                <div className="flex gap-1.5">
                  {(['9:16', '16:9', '1:1'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setAspectRatio(r)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        aspectRatio === r
                          ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Voice-Over Narration
                </label>
                <select
                  value={voiceOver}
                  onChange={(e) => setVoiceOver(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Natural Male - Energetic">Natural Male - Energetic</option>
                  <option value="Warm Female - Conversational">Warm Female - Conversational</option>
                  <option value="Professional Neutral">Professional Neutral</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Background Music
                </label>
                <select
                  value={backgroundMusic}
                  onChange={(e) => setBackgroundMusic(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Cinematic Lo-Fi Beat">Cinematic Lo-Fi Beat</option>
                  <option value="Upbeat Tech Corporate">Upbeat Tech Corporate</option>
                  <option value="Energetic Electronic">Energetic Electronic</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateScript}
              disabled={isGeneratingScript}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingScript ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating AI Scenes &amp; Script...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Script &amp; Scenes</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 2: SCENE-BY-SCENE EDITOR */}
        {step === 'script' && (
          <div className="space-y-4">
            {/* Script Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Film className="w-4 h-4 text-indigo-500" />
                <span>Script Breakdown ({scenes.length} Scenes)</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShortenScript}
                  className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-[11px] font-bold rounded-xl transition-colors"
                >
                  Shorten Script
                </button>
                <button
                  type="button"
                  onClick={handleRegenerateScript}
                  disabled={isGeneratingScript}
                  className="px-3 py-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 text-[11px] font-bold rounded-xl transition-colors flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isGeneratingScript ? 'animate-spin' : ''}`} />
                  <span>Regenerate</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddScene}
                  className="px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-500 text-[11px] font-bold rounded-xl transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Scene</span>
                </button>
              </div>
            </div>

            {/* Scenes List */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
              {scenes.map((sc, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-md">
                      Scene #{sc.sceneNumber} ({sc.durationSeconds}s)
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeleteScene(idx)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">
                        Voice Narration / Script
                      </label>
                      <textarea
                        rows={2}
                        value={sc.narration}
                        onChange={(e) => handleSceneChange(idx, 'narration', e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">
                        On-Screen Subtitle Text
                      </label>
                      <input
                        type="text"
                        value={sc.onScreenText}
                        onChange={(e) => handleSceneChange(idx, 'onScreenText', e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Render Action Button */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStep('prompt')}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                ← Back to Prompt
              </button>

              <button
                type="button"
                onClick={handleRenderFinalVideo}
                disabled={isGeneratingVideo}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGeneratingVideo ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Rendering AI Storyboard...</span>
                  </>
                ) : (
                  <>
                    <span>Render Storyboard &amp; Video Preview</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: STORYBOARD & FINAL PREVIEW */}
        {step === 'preview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Video Player Display */}
              <div className="space-y-3">
                <div className="relative rounded-2xl bg-slate-950 overflow-hidden aspect-[9/16] max-h-72 border border-slate-800 flex items-center justify-center shadow-2xl mx-auto">
                  <img
                    src={renderedVideoUrl || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80'}
                    alt="Rendered Video Preview"
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-center justify-center">
                    <button className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white flex items-center justify-center shadow-2xl transition-all transform hover:scale-110">
                      <Play className="w-5 h-5 text-white ml-0.5 fill-white" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md p-2 rounded-xl text-center border border-slate-700">
                    <p className="text-xs font-bold text-white uppercase tracking-wider">{scenes[0]?.onScreenText || 'AI REEL'}</p>
                  </div>
                </div>
              </div>

              {/* Summary Specs */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>AI Video Asset Specs</span>
                </h3>

                <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1">
                    <span className="text-slate-400">Total Duration:</span>
                    <span className="font-bold">{scenes.reduce((a, b) => a + b.durationSeconds, 0)} seconds</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1">
                    <span className="text-slate-400">Aspect Ratio:</span>
                    <span className="font-bold">{aspectRatio}</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1">
                    <span className="text-slate-400">Voice Narration:</span>
                    <span className="font-bold">{voiceOver}</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1">
                    <span className="text-slate-400">Background Music:</span>
                    <span className="font-bold">{backgroundMusic} ({musicVolume}%)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                    Full AI Script Output
                  </span>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed max-h-28 overflow-y-auto">
                    {scenes.map((s) => s.narration).join(' ')}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStep('script')}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                ← Edit Scenes
              </button>

              <button
                type="button"
                onClick={handleFinalConfirm}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/25 hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Attach AI Video &amp; Continue Publishing</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
