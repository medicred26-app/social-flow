'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Post, 
  SocialAccount, 
  SocialPlatform, 
  MediaItem, 
  PostTarget, 
  CreateStartType, 
  PostConfiguration, 
  PlatformVariant,
  UploadMetadata
} from '@/types';
import { 
  getStoredAccounts, 
  getStoredPosts, 
  saveStoredPosts, 
  getStoredLibraryItems, 
  saveStoredLibraryItems,
  SocialTemplate
} from '@/lib/store';
import { CreateTypeSelector } from '@/components/compose/CreateTypeSelector';
import { UploadModal } from '@/components/compose/UploadModal';
import { AIVideoModal } from '@/components/compose/AIVideoModal';
import { BrandKitModal } from '@/components/compose/BrandKitModal';
import { TemplatesModal } from '@/components/compose/TemplatesModal';
import { ConfigurePanel } from '@/components/compose/ConfigurePanel';
import { PlatformAdaptationEditor } from '@/components/compose/PlatformAdaptationEditor';
import { PlatformSelector } from '@/components/compose/PlatformSelector';
import { CaptionBox } from '@/components/compose/CaptionBox';
import { MediaUploader } from '@/components/compose/MediaUploader';
import { LivePreviewCard } from '@/components/compose/LivePreviewCard';
import { SchedulePicker } from '@/components/compose/SchedulePicker';
import { platformRegistry } from '@/lib/platforms';
import { 
  PenSquare, 
  CheckCircle2, 
  AlertCircle, 
  Bookmark, 
  Wand2, 
  Layers, 
  Sliders, 
  Sparkles, 
  Check, 
  Share2, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { format, addDays } from 'date-fns';

export default function ComposePage() {
  const router = useRouter();

  // Workflow Steps Navigation
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<
    'create' | 'configure' | 'channels' | 'adapt' | 'publish' | 'confirmation'
  >('create');

  // Accounts & Selection
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);

  // Creation Type & State
  const [startType, setStartType] = useState<CreateStartType>('post');
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [variants, setVariants] = useState<PlatformVariant[]>([]);

  // Configuration Settings (Section 4 PDF)
  const [config, setConfig] = useState<PostConfiguration>({
    privacy: 'public',
    audienceVisibility: 'all',
    allowComments: true,
    allowDownloads: true,
    usagePermissionConfirmed: true,
  });

  // Modal Dialog Toggles
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAIVideoModal, setShowAIVideoModal] = useState(false);
  const [showBrandKitModal, setShowBrandKitModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

  // Scheduling State
  const tomorrowStr = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  const [scheduledDate, setScheduledDate] = useState(tomorrowStr);
  const [scheduledTime, setScheduledTime] = useState('10:00');

  // Submission & Results
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [publishedPostResult, setPublishedPostResult] = useState<Post | null>(null);

  useEffect(() => {
    const accs = getStoredAccounts();
    setAccounts(accs);
    const active = accs.filter((a) => a.connected).map((a) => a.id);
    setSelectedAccountIds(active);

    // Pre-load context from Content Studio, Library, or Projects
    if (typeof window !== 'undefined') {
      const rawDraft = sessionStorage.getItem('socialflow_studio_draft');
      if (rawDraft) {
        try {
          const draft = JSON.parse(rawDraft);
          if (draft.caption) {
            const tagsStr = Array.isArray(draft.hashtags) ? draft.hashtags.join(' ') : '';
            setCaption(`${draft.caption}\n\n${tagsStr}`);
          }
          if (draft.mediaUrl) {
            setMedia([
              {
                id: `m-studio-${Date.now()}`,
                url: draft.mediaUrl,
                type: 'video',
                name: `${(draft.title || 'Studio_Export').toLowerCase().replace(/\s+/g, '_')}.mp4`,
                size: '12.4 MB',
              },
            ]);
          }
          setNotification({
            type: 'success',
            message: `✨ Pre-loaded content "${draft.title || 'Asset'}" from Content Studio into publisher!`,
          });
          sessionStorage.removeItem('socialflow_studio_draft');
        } catch (e) {}
      }
    }
  }, []);

  const handleToggleAccount = (id: string) => {
    if (selectedAccountIds.includes(id)) {
      setSelectedAccountIds(selectedAccountIds.filter((aId) => aId !== id));
    } else {
      setSelectedAccountIds([...selectedAccountIds, id]);
    }
  };

  const handleAddMedia = (item: MediaItem) => {
    setMedia([...media, item]);
  };

  const handleRemoveMedia = (id: string) => {
    setMedia(media.filter((m) => m.id !== id));
  };

  const selectedAccounts = accounts.filter((a) => selectedAccountIds.includes(a.id));
  const selectedPlatforms = Array.from(new Set(selectedAccounts.map((a) => a.platform)));

  const canSubmit = selectedAccountIds.length > 0 && caption.trim().length > 0;

  // Handlers for modals
  const handleUploadSuccess = (mediaItem: MediaItem, metadata: UploadMetadata) => {
    setMedia([mediaItem]);
    setCaption(`${metadata.title}\n\n${metadata.description}\n\n${metadata.tags.join(' ')}`);
    setNotification({
      type: 'success',
      message: `📥 Uploaded "${metadata.title}" (${metadata.contentType.toUpperCase()}) with full metadata!`,
    });
  };

  const handleAIVideoApply = (videoUrl: string, aiCaption: string, hashtags: string[], title: string) => {
    setMedia([
      {
        id: `m-ai-${Date.now()}`,
        url: videoUrl,
        type: 'video',
        name: `${title.toLowerCase().replace(/\s+/g, '_')}.mp4`,
        size: '14.8 MB',
      },
    ]);
    setCaption(aiCaption);
    setNotification({
      type: 'success',
      message: `✨ Attached AI Video and generated multi-scene script for "${title}"!`,
    });
  };

  const handleSelectTemplate = (template: SocialTemplate) => {
    setCaption(`${template.suggestedCaption}\n\n${template.hashtags.join(' ')}`);
    setNotification({
      type: 'success',
      message: `🎨 Applied "${template.name}" template structure!`,
    });
  };

  // Execution flow for Publish Now / Schedule / Save Draft
  const executePublishFlow = async (isImmediate: boolean, isDraft = false) => {
    if (!isDraft && !canSubmit) return;
    setIsSubmitting(true);
    setNotification(null);

    let postTargets: PostTarget[] = selectedAccounts.map((acc) => ({
      platform: acc.platform,
      accountId: acc.id,
      status: 'pending',
    }));

    if (isImmediate && !isDraft) {
      const mediaUrls = media.map((m) => m.url);
      const publishPromises = postTargets.map(async (target) => {
        try {
          const adapter = platformRegistry.getAdapter(target.platform);

          // Use platform specific adapted caption if available
          const variant = variants.find((v) => v.platform === target.platform);
          const finalPlatformCaption = variant ? `${variant.caption}\n\n${variant.hashtags.join(' ')}` : caption;

          const res = await adapter.publish({
            caption: finalPlatformCaption,
            mediaUrls,
            accountId: target.accountId,
          });

          if (res.success && res.platformPostId) {
            return {
              ...target,
              status: 'published' as const,
              publishedAt: new Date().toISOString(),
              platformPostId: res.platformPostId,
            };
          } else {
            return {
              ...target,
              status: 'failed' as const,
              error: res.error || `Publishing failed on ${target.platform}`,
            };
          }
        } catch (err: any) {
          return {
            ...target,
            status: 'failed' as const,
            error: err.message || `Platform outage on ${target.platform}`,
          };
        }
      });

      const settled = await Promise.allSettled(publishPromises);
      postTargets = settled.map((item, idx) => {
        if (item.status === 'fulfilled') return item.value;
        return {
          ...postTargets[idx],
          status: 'failed' as const,
          error: 'Platform execution failed',
        };
      });
    }

    const scheduledIso = new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString();
    const successCount = postTargets.filter((t) => t.status === 'published').length;

    let overallStatus: any = 'scheduled';
    if (isDraft) {
      overallStatus = 'draft';
    } else if (isImmediate) {
      if (successCount === postTargets.length) overallStatus = 'published';
      else if (successCount > 0) overallStatus = 'partially_failed';
      else overallStatus = 'failed';
    }

    const newPost: Post = {
      id: `post-${Date.now()}`,
      caption,
      media,
      targets: postTargets,
      scheduledFor: isImmediate ? new Date().toISOString() : scheduledIso,
      status: overallStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'user-demo',
    };

    // Save to Post Queue & Library
    const currentPosts = getStoredPosts();
    saveStoredPosts([newPost, ...currentPosts]);

    const libraryItems = getStoredLibraryItems();
    const newLibItem = {
      id: `lib-${Date.now()}`,
      title: caption.slice(0, 30) || 'Published Master Asset',
      media,
      thumbnailUrl: media[0]?.url,
      caption,
      hashtags: [],
      contentType: (media[0]?.type === 'video' ? 'video' : 'text') as any,
      creationSource: 'user_upload' as any,
      status: overallStatus === 'published' ? 'published' : 'scheduled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      platformVariants: variants,
    };
    saveStoredLibraryItems([newLibItem, ...libraryItems as any]);

    setIsSubmitting(false);
    setPublishedPostResult(newPost);
    setActiveWorkflowTab('confirmation');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title & Brand Kit Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl shadow-lg shadow-indigo-500/20">
            <PenSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Create &amp; Publish Content
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              End-to-end master creation, AI script enhancement, platform adaptation &amp; publishing queue
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowBrandKitModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          <Bookmark className="w-4 h-4 text-purple-500" />
          <span>Brand Kit Settings</span>
        </button>
      </div>

      {/* Alert Notification */}
      {notification && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold shadow-sm ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Core Workflow Step Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
        {[
          { id: 'create', label: '1. Create & Edit', icon: PenSquare },
          { id: 'configure', label: '2. Configure Settings', icon: Sliders },
          { id: 'channels', label: '3. Select Channels', icon: Share2 },
          { id: 'adapt', label: '4. Adapt & Preview', icon: Layers },
          { id: 'publish', label: '5. Schedule / Publish', icon: Clock },
          { id: 'confirmation', label: '6. Confirmation', icon: CheckCircle2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeWorkflowTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveWorkflowTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* WORKFLOW TAB 1: CREATE & EDIT */}
      {activeWorkflowTab === 'create' && (
        <div className="space-y-6">
          <CreateTypeSelector
            selectedType={startType}
            onSelectType={setStartType}
            onOpenAIVideoModal={() => setShowAIVideoModal(true)}
            onOpenUploadModal={() => setShowUploadModal(true)}
            onOpenTemplatesModal={() => setShowTemplatesModal(true)}
            onOpenRepurposeModal={() => setActiveWorkflowTab('adapt')}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <CaptionBox caption={caption} onChange={setCaption} selectedPlatforms={selectedPlatforms} />

              <MediaUploader media={media} onAddMedia={handleAddMedia} onRemoveMedia={handleRemoveMedia} />
            </div>

            <div className="lg:col-span-5 space-y-6">
              <LivePreviewCard caption={caption} media={media} selectedPlatforms={selectedPlatforms} />

              <button
                onClick={() => setActiveWorkflowTab('configure')}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Step 2: Configure Settings</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WORKFLOW TAB 2: CONFIGURE */}
      {activeWorkflowTab === 'configure' && (
        <div className="space-y-6">
          <ConfigurePanel config={config} onChangeConfig={setConfig} />

          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveWorkflowTab('create')}
              className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl"
            >
              ← Back to Create &amp; Edit
            </button>

            <button
              onClick={() => setActiveWorkflowTab('channels')}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Continue to Step 3: Select Channels</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* WORKFLOW TAB 3: CHANNELS */}
      {activeWorkflowTab === 'channels' && (
        <div className="space-y-6">
          <PlatformSelector
            accounts={accounts}
            selectedAccountIds={selectedAccountIds}
            onToggleAccount={handleToggleAccount}
          />

          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveWorkflowTab('configure')}
              className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl"
            >
              ← Back to Configure
            </button>

            <button
              onClick={() => setActiveWorkflowTab('adapt')}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Continue to Step 4: Adapt &amp; Preview</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* WORKFLOW TAB 4: ADAPT & PREVIEW */}
      {activeWorkflowTab === 'adapt' && (
        <div className="space-y-6">
          <PlatformAdaptationEditor
            masterCaption={caption}
            selectedPlatforms={selectedPlatforms}
            variants={variants}
            onChangeVariants={setVariants}
          />

          <LivePreviewCard caption={caption} media={media} selectedPlatforms={selectedPlatforms} />

          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveWorkflowTab('channels')}
              className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl"
            >
              ← Back to Select Channels
            </button>

            <button
              onClick={() => setActiveWorkflowTab('publish')}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Continue to Step 5: Schedule &amp; Publish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* WORKFLOW TAB 5: PUBLISH & SCHEDULE */}
      {activeWorkflowTab === 'publish' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <SchedulePicker
            scheduledDate={scheduledDate}
            scheduledTime={scheduledTime}
            onDateChange={setScheduledDate}
            onTimeChange={setScheduledTime}
            onPublishNow={() => executePublishFlow(true)}
            onScheduleLater={() => executePublishFlow(false)}
            onSaveDraft={() => executePublishFlow(false, true)}
            isSubmitting={isSubmitting}
            canSubmit={canSubmit}
          />

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveWorkflowTab('adapt')}
              className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl"
            >
              ← Back to Adapt &amp; Preview
            </button>
          </div>
        </div>
      )}

      {/* WORKFLOW TAB 6: CONFIRMATION & INDIVIDUAL STATUS */}
      {activeWorkflowTab === 'confirmation' && (
        <div className="space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {publishedPostResult?.status === 'published'
                ? '🚀 Content Published Successfully Everywhere!'
                : publishedPostResult?.status === 'scheduled'
                ? '📅 Content Queued for Automated Publishing!'
                : publishedPostResult?.status === 'partially_failed'
                ? '⚠️ Published with Individual Target Statuses'
                : '📁 Post Saved as Draft'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Per PDF workflow specs, individual status tracking per channel is displayed below.
            </p>
          </div>

          {/* Individual Channel Target Status Table */}
          {publishedPostResult && (
            <div className="space-y-2 max-w-lg mx-auto text-left bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-2">
                Individual Target Channel Statuses
              </h3>
              {publishedPostResult.targets.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5">
                  <span className="font-bold text-slate-900 dark:text-white capitalize">{t.platform}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      t.status === 'published'
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : t.status === 'failed'
                        ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                        : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl"
            >
              Go to Command Dashboard
            </button>
            <button
              onClick={() => router.push('/library')}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-xl shadow-md"
            >
              View in Content Library
            </button>
          </div>
        </div>
      )}

      {/* MODAL DIALOGS */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      <AIVideoModal
        isOpen={showAIVideoModal}
        onClose={() => setShowAIVideoModal(false)}
        onApplyVideo={handleAIVideoApply}
      />

      <BrandKitModal isOpen={showBrandKitModal} onClose={() => setShowBrandKitModal(false)} />

      <TemplatesModal
        isOpen={showTemplatesModal}
        onClose={() => setShowTemplatesModal(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}
