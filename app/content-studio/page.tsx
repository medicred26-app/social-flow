'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Wand2, 
  Video, 
  Image as ImageIcon, 
  Sparkles, 
  Scissors, 
  FileText, 
  Send, 
  FolderPlus, 
  UserPlus, 
  CheckCircle2, 
  RefreshCw, 
  Zap, 
  ArrowRight
} from 'lucide-react';
import { ContentItem } from '@/types';
import { saveStoredLibraryItems, getStoredLibraryItems } from '@/lib/store';
import { aiPost, generateAiVideo, getBackendUrl } from '@/lib/ai';
import { composeMotionVideo, isPlayableVideoUrl, StoryboardScene } from '@/lib/video-compose';
import { PipelineStepper, PipelineStage } from '@/components/studio/PipelineStepper';
import { VideoPreviewPlayer } from '@/components/studio/VideoPreviewPlayer';

export default function ContentStudioPage() {
  const router = useRouter();

  // Active Tool Tab
  const [activeTab, setActiveTab] = useState<'video' | 'captions' | 'thumbnail' | 'repurpose'>('video');

  // Media preview state
  const [mediaTitle, setMediaTitle] = useState('AI Launch Showcase Reel');
  const [videoUrl, setVideoUrl] = useState(
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80'
  );
  const [thumbnailUrl, setThumbnailUrl] = useState(
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'
  );
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1'>('9:16');

  // AI Prompt & Outputs
  const [prompt, setPrompt] = useState('Create a high-energy 15-second product reel showcasing AI automation features. Open with a creator staring at a messy content calendar, then reveal SocialFlow turning one script into YouTube, Instagram, and Facebook cuts.');
  const [presenter, setPresenter] = useState<'ai_avatar' | 'screen' | 'animation'>('animation');
  const [language, setLanguage] = useState('English');
  const [durationSeconds, setDurationSeconds] = useState(15);
  const [brandName, setBrandName] = useState('SocialFlow');
  const [platforms, setPlatforms] = useState<string[]>(['youtube', 'instagram', 'facebook']);
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>([]);
  const [pipelineNotes, setPipelineNotes] = useState<string[]>([]);
  const [reviewReady, setReviewReady] = useState(false);
  const [previewScenes, setPreviewScenes] = useState<StoryboardScene[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [captionText, setCaptionText] = useState(
    '🚀 Transform your social media workflow with AI Content Studio! Generate viral videos, auto-captioning, and instant multi-platform scheduling.'
  );
  const [hookText, setHookText] = useState('Stop spending hours editing raw videos manually!');
  const [ctaText, setCTAText] = useState('Comment "AUTOMATE" below to test the instant demo!');
  const [hashtags, setHashtags] = useState(['#SocialMediaAutomation', '#ContentCreator', '#AIStudio', '#BuildInPublic']);

  // Notification state
  const [notif, setNotif] = useState<string | null>(null);

  const togglePlatform = (platform: string) => {
    setPlatforms((current) =>
      current.includes(platform)
        ? current.filter((item) => item !== platform)
        : [...current, platform]
    );
  };

  const resolveMediaUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('/')) return `${getBackendUrl()}${url}`;
    return url;
  };

  const handleGenerateAIVideo = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setReviewReady(false);
    setPipelineNotes([]);
    setNotif('Starting the script-to-publish pipeline...');
    try {
      const data = await generateAiVideo(
        {
          script: prompt,
          prompt,
          title: mediaTitle,
          presenter,
          language,
          brandName,
          platforms,
          aspectRatio,
          durationSeconds,
        },
        (status, job) => {
          const stages = (job?.stages || []) as PipelineStage[];
          if (stages.length) setPipelineStages(stages);
          setNotif(status);
        }
      );
      if (Array.isArray(data.pipeline?.stages)) setPipelineStages(data.pipeline.stages);
      if (Array.isArray(data.pipeline?.assetNotes)) setPipelineNotes(data.pipeline.assetNotes);
      if (data.storyboard?.title) setMediaTitle(data.storyboard.title);
      if (data.thumbnailUrl) setThumbnailUrl(resolveMediaUrl(data.thumbnailUrl));
      if (data.caption) setCaptionText(data.caption);
      if (data.hook) setHookText(data.hook);
      if (data.cta) setCTAText(data.cta);
      if (Array.isArray(data.hashtags)) setHashtags(data.hashtags);

      const remoteVideo = data.videoUrl ? resolveMediaUrl(data.videoUrl) : '';
      const audioUrl = data.audioUrl ? resolveMediaUrl(data.audioUrl) : '';
      const scenes: StoryboardScene[] = data.storyboard?.scenes || [
        { heading: 'HOOK', line: data.hook || prompt, color: '#4f46e5' },
        { heading: 'STORY', line: data.script || data.caption || prompt, color: '#7c3aed' },
        { heading: 'CTA', line: data.cta || 'Follow for more', color: '#db2777' },
      ];
      setPreviewScenes(scenes);
      if (remoteVideo && !isPlayableVideoUrl(remoteVideo)) {
        setThumbnailUrl(remoteVideo);
      }

      if (data.mediaType === 'video' && isPlayableVideoUrl(remoteVideo)) {
        setVideoUrl(remoteVideo);
      } else {
        const composed = await composeMotionVideo({
          title: data.storyboard?.title || mediaTitle,
          scenes,
          aspectRatio,
          durationSeconds: Number(data.durationSeconds) || durationSeconds,
          brandName,
          audioUrl,
        });
        setVideoUrl(composed);
      }
      setReviewReady(true);
      setNotif(data.message || 'Pipeline finished. Review the reel, then send it to Publisher.');
    } catch (err: any) {
      setNotif(err.message || 'Video generation failed.');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setNotif(null), 8000);
    }
  };

  const handleGenerateCaptions = async () => {
    setIsGenerating(true);
    try {
      const data = await aiPost('/captions/generate', {
        topic: prompt || mediaTitle,
        platform: 'instagram',
        tone: 'engaging',
      });
      if (data.caption) setCaptionText(data.caption);
      if (data.hook) setHookText(data.hook);
      if (data.cta) setCTAText(data.cta);
      if (Array.isArray(data.hashtags)) setHashtags(data.hashtags);
      setNotif('✨ Gemini wrote a caption, hook, CTA, and hashtags.');
    } catch (err: any) {
      setNotif(err.message || 'Caption generation failed.');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setNotif(null), 4000);
    }
  };

  const handleGenerateThumbnail = async () => {
    setIsGenerating(true);
    try {
      const data = await aiPost('/thumbnail/generate', {
        title: mediaTitle,
        prompt,
        aspectRatio,
      });
      if (data.thumbnailUrl) setThumbnailUrl(resolveMediaUrl(data.thumbnailUrl));
      setNotif('✨ Gemini generated a thumbnail.');
    } catch (err: any) {
      setNotif(err.message || 'Thumbnail generation failed.');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setNotif(null), 4000);
    }
  };

  const handleSaveToLibrary = () => {
    const newItem: ContentItem = {
      id: `lib-${Date.now()}`,
      title: mediaTitle,
      description: prompt,
      media: [
        {
          id: `m-${Date.now()}`,
          url: videoUrl,
          type: 'video',
          name: `${mediaTitle.toLowerCase().replace(/\s+/g, '_')}.mp4`,
          size: '12.4 MB'
        }
      ],
      thumbnailUrl,
      caption: `${hookText}\n\n${captionText}\n\n${ctaText}`,
      hashtags,
      contentType: 'video',
      creationSource: 'ai_generated',
      status: 'ready',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const current = getStoredLibraryItems();
    saveStoredLibraryItems([newItem, ...current]);
    setNotif('📁 Saved content item to your Content Library!');
    setTimeout(() => {
      setNotif(null);
      router.push('/library');
    }, 1200);
  };

  const handleSendToPublisher = () => {
    if (typeof window !== 'undefined') {
      const payload = {
        title: mediaTitle,
        mediaUrl: videoUrl,
        thumbnailUrl,
        caption: `${hookText}\n\n${captionText}\n\n${ctaText}`,
        hashtags,
        aspectRatio
      };
      sessionStorage.setItem('socialflow_studio_draft', JSON.stringify(payload));
    }
    router.push('/compose?fromStudio=true');
  };

  const handleHireFreelancer = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('socialflow_hire_context', JSON.stringify({
        title: mediaTitle,
        mediaUrl: videoUrl,
        category: 'video_editing'
      }));
    }
    router.push('/services?category=video_editing');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white rounded-2xl shadow-lg shadow-indigo-500/20">
            <Wand2 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Content Studio</span>
              <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-500/20">
                AI Workspace
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              One script to planned scenes, generated assets, assembled reel, review, then publish.
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleHireFreelancer}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-purple-500" />
            <span>Hire an Expert</span>
          </button>

          <button
            onClick={handleSaveToLibrary}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-indigo-500" />
            <span>Save to Library</span>
          </button>

          <button
            onClick={handleSendToPublisher}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Send to Publisher</span>
          </button>
        </div>
      </div>

      {/* Alert Notification */}
      {notif && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notif}</span>
        </div>
      )}

      {(isGenerating || pipelineStages.length > 0) && (
        <div className="space-y-2">
          <PipelineStepper stages={pipelineStages} />
          {pipelineNotes.length > 0 && (
            <p className="text-[11px] text-slate-500">{pipelineNotes.join(' · ')}</p>
          )}
        </div>
      )}

      {/* Main Studio Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (7 cols): Canvas & Timeline Editor */}
        <div className="lg:col-span-7 space-y-6">
          {/* Media Player Canvas */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={mediaTitle}
                onChange={(e) => setMediaTitle(e.target.value)}
                className="font-bold text-base text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 focus:outline-none px-1 py-0.5 transition-colors max-w-sm"
              />
              <div className="flex items-center gap-2">
                {(['9:16', '16:9', '1:1'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      aspectRatio === ratio
                        ? 'bg-indigo-500 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <VideoPreviewPlayer
              title={mediaTitle}
              videoUrl={videoUrl}
              aspectRatio={aspectRatio}
              scenes={previewScenes}
            />

            {/* Timeline Trimmer & Controls Bar */}
            <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Scissors className="w-4 h-4 text-indigo-500" />
                  <span>Timeline &amp; Auto Trimmer</span>
                </span>
                <span className="text-[11px] text-slate-400 font-normal">Duration: {durationSeconds}s</span>
              </div>
              
              <div className="w-full h-6 bg-slate-200 dark:bg-slate-800 rounded-lg relative overflow-hidden flex items-center p-1 cursor-pointer">
                <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-md w-full relative">
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-white rounded-l-md cursor-ew-resize" />
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-r-md cursor-ew-resize" />
                </div>
              </div>
            </div>
          </div>

          {/* AI Tools Selection Tabs */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab('video')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'video'
                    ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>AI Video Generator</span>
              </button>

              <button
                onClick={() => setActiveTab('captions')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'captions'
                    ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Captions &amp; Hooks</span>
              </button>

              <button
                onClick={() => setActiveTab('thumbnail')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'thumbnail'
                    ? 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Thumbnail Generator</span>
              </button>

              <button
                onClick={() => setActiveTab('repurpose')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'repurpose'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Content Repurposer</span>
              </button>
            </div>

            {/* TAB CONTENT: AI Video Generator */}
            {activeTab === 'video' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Script
                  </label>
                  <textarea
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Write the full script. Gemini will break it into timed scenes."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Presenter</label>
                    <select
                      value={presenter}
                      onChange={(e) => setPresenter(e.target.value as typeof presenter)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs"
                    >
                      <option value="animation">2D animation / Veo</option>
                      <option value="ai_avatar">AI presenter</option>
                      <option value="screen">Screen / product</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs"
                    >
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Duration</label>
                    <select
                      value={durationSeconds}
                      onChange={(e) => setDurationSeconds(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs"
                    >
                      <option value={8}>8 seconds</option>
                      <option value={15}>15 seconds</option>
                      <option value={30}>30 seconds</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Brand</label>
                    <input
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Publish to</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'youtube', label: 'YouTube' },
                      { id: 'instagram', label: 'Instagram' },
                      { id: 'facebook', label: 'Facebook' },
                      { id: 'tiktok', label: 'TikTok' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => togglePlatform(item.id)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border ${
                          platforms.includes(item.id)
                            ? 'bg-indigo-500 text-white border-indigo-500'
                            : 'bg-slate-50 dark:bg-slate-950 text-slate-600 border-slate-300 dark:border-slate-800'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerateAIVideo}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>{isGenerating ? 'Running pipeline… keep this tab open' : 'Submit script & generate'}</span>
                </button>
              </div>
            )}

            {/* TAB CONTENT: Captions & Hooks */}
            {activeTab === 'captions' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Viral Hook Line
                    </label>
                    <input
                      type="text"
                      value={hookText}
                      onChange={(e) => setHookText(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Call-To-Action (CTA)
                    </label>
                    <input
                      type="text"
                      value={ctaText}
                      onChange={(e) => setCTAText(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Caption Body
                  </label>
                  <textarea
                    rows={4}
                    value={captionText}
                    onChange={(e) => setCaptionText(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  onClick={handleGenerateCaptions}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate New Captions, Hooks &amp; Hashtags</span>
                </button>
              </div>
            )}

            {/* TAB CONTENT: Thumbnail Generator */}
            {activeTab === 'thumbnail' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-32 h-20 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                    <img src={thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Cover / Thumbnail Preview</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      High-contrast 16:9 and 9:16 cover thumbnail preset.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleGenerateThumbnail}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-md shadow-pink-500/20 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI High-CTR Thumbnail</span>
                </button>
              </div>
            )}

            {/* TAB CONTENT: Content Repurposer */}
            {activeTab === 'repurpose' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Automatically package your master video into 5 platform-optimized versions tailored for X, LinkedIn, Instagram, Facebook, and YouTube Shorts.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
                    📱 Instagram Reels (9:16)
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
                    ▶️ YouTube Shorts (9:16)
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
                    💼 LinkedIn Video + Article
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
                    🐦 X Video Tweet + Thread
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
                    👥 Facebook Watch (1:1)
                  </div>
                </div>

                <button
                  onClick={async () => {
                    setIsGenerating(true);
                    try {
                      const data = await aiPost('/repurpose', {
                        sourceContent: `${hookText}\n\n${captionText}\n\n${ctaText}\n\n${prompt}`,
                      });
                      const versions = Array.isArray(data.versions) ? data.versions : [];
                      const first = versions.find((v: { caption?: string }) => v.caption);
                      if (first?.caption) setCaptionText(first.caption);
                      setNotif(
                        versions.length
                          ? `✨ Gemini created ${versions.length} platform versions. Send to Publisher to post.`
                          : '✨ Gemini repurposed your content.'
                      );
                    } catch (err: any) {
                      setNotif(err.message || 'Repurpose failed.');
                    } finally {
                      setIsGenerating(false);
                      setTimeout(() => setNotif(null), 4000);
                    }
                  }}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Repurpose for All Platforms</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): AI Content Suggestions & Live Package Inspector */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-500" />
              <span>Live Content Package</span>
            </h3>

            {/* Hook Line Box */}
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400">Viral Hook Line</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">{hookText}</p>
            </div>

            {/* Caption & Hashtag Box */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Main Caption</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-1">{captionText}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Target Hashtags</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {hashtags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-semibold rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Call-To-Action</span>
                <p className="text-xs font-semibold text-pink-600 dark:text-pink-400 mt-0.5">{ctaText}</p>
              </div>
            </div>

            {reviewReady && (
              <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400">
                  Review before publishing
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  The reel is stored for review. Play it, edit the caption if needed, then send it to Publisher for YouTube, Instagram, and Facebook.
                </p>
              </div>
            )}

            {/* Send to Publisher Callout Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-pink-900/20 border border-indigo-500/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Ready to Schedule Across 5 Channels?</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Clicking <strong className="text-white">Send to Publisher</strong> transfers this video, thumbnail, caption, and hashtags directly into the SocialFlow multi-platform queue without needing to download.
              </p>

              <button
                onClick={handleSendToPublisher}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all cursor-pointer"
              >
                <span>Proceed to Social Publishing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
