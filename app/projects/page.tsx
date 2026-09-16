'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  FolderKanban, 
  Plus, 
  MessageSquare, 
  ExternalLink, 
  AlertCircle, 
  ArrowLeft,
  Video,
  Image,
  Sparkles,
  Trash2,
  X,
  FileCheck,
  Send
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { fetchMyJobs, updateJobStatus, createJobRequest, Job } from '@/lib/marketplace';
import MessagingWidget from '@/components/messaging/MessagingWidget';

export default function ClientProjectsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'in_progress' | 'review' | 'completed'>('all');
  const [notif, setNotif] = useState<string | null>(null);

  // Active chat state
  const [activeChat, setActiveChat] = useState<{
    conversationId: string;
    recipientName: string;
    jobTitle?: string;
  } | null>(null);

  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectPrice, setNewProjectPrice] = useState('500');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    loadJobs();
  }, [user]);

  const loadJobs = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchMyJobs(user.id);
      setJobs(data || []);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'in_progress') return job.status === 'open' || job.status === 'in_progress';
    if (activeTab === 'review') return job.status === 'review';
    if (activeTab === 'completed') return job.status === 'completed';
    return true;
  });

  const getStatusBadge = (status: Job['status']) => {
    switch (status) {
      case 'open':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-400 inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Open for Proposals
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-400 inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            In Progress
          </span>
        );
      case 'review':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 border border-purple-500/30 text-purple-300 inline-flex items-center gap-1.5 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Deliverable Ready
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400">
            {status}
          </span>
        );
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    }
  };

  const handleCreateDeviceProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim() || !user) return;

    try {
      const budgetNum = parseInt(newProjectPrice, 10) || 500;
      const mediaUrl = filePreviewUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';

      const res = await createJobRequest({
        clientId: user.id,
        title: newProjectTitle,
        description: newProjectDesc || 'Uploaded asset for social media processing',
        category: 'video_editing',
        budget: budgetNum,
        attachments: [mediaUrl]
      });

      if (res.success) {
        setNotif(`🚀 Project "${newProjectTitle}" created successfully!`);
        setShowUploadModal(false);
        setNewProjectTitle('');
        setNewProjectDesc('');
        setSelectedFile(null);
        setFilePreviewUrl(null);
        loadJobs();
      } else {
        setNotif(`❌ Failed: ${res.error || 'Could not create project'}`);
      }
    } catch (err: any) {
      setNotif(`❌ Error: ${err.message}`);
    }
    setTimeout(() => setNotif(null), 4000);
  };

  const handleApproveJob = async (job: Job) => {
    try {
      const res = await updateJobStatus(job.id, 'completed');
      if (res.success) {
        setNotif(`🎉 Project "${job.title}" approved & marked completed!`);
        loadJobs();
      } else {
        setNotif(`❌ Failed to update status: ${res.error}`);
      }
    } catch (err: any) {
      setNotif(`❌ Error: ${err.message}`);
    }
    setTimeout(() => setNotif(null), 4000);
  };

  const handleOpenChat = (job: Job) => {
    if (!job.freelancer_id && !job.client_id) {
      setNotif('No other participant assigned to this job yet.');
      setTimeout(() => setNotif(null), 3000);
      return;
    }

    const isClient = user?.id === job.client_id;
    // Use freelancer_user_id (auth user ID) if available; fall back to freelancer_id (profile UUID)
    // This is critical: the freelancer signs in with their auth user_id, NOT their profile UUID
    const otherId = isClient
      ? (job.freelancer_user_id || job.freelancer_id || 'freelancer')
      : job.client_id;
    const otherName = isClient
      ? (job.freelancer_name || 'Freelancer')
      : (job.client_name || 'Client');
    const otherAvatar = isClient ? (job.freelancer_avatar || undefined) : undefined;

    window.dispatchEvent(
      new CustomEvent('socialflow_open_chat', {
        detail: {
          participant: {
            id: otherId,
            name: otherName,
            avatar: otherAvatar
          },
          jobId: job.id
        }
      })
    );
  };


  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 selection:bg-indigo-500/30 font-sans pb-24">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Toast */}
        {notif && (
          <div className="fixed bottom-6 right-6 z-50 bg-indigo-600/90 text-white px-5 py-3 rounded-2xl shadow-xl border border-indigo-400/30 backdrop-blur-md text-sm font-medium flex items-center gap-2 animate-bounce">
            <span>{notif}</span>
          </div>
        )}

        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/services')}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </button>
          
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Upload Asset & Post Job
          </button>
        </div>

        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <ClipboardList className="w-4 h-4" />
            Client Dashboard
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            My Orders & Projects
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-2xl">
            Track hired specialists, monitor progress, chat in real-time, and approve completed deliverables.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 bg-slate-900/40 p-1.5 rounded-2xl border border-slate-800/80 w-fit">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'review', label: 'In Review' },
            { id: 'completed', label: 'Completed' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading / Empty / Content */}
        {loading ? (
          <div className="text-center py-20 text-slate-400 text-sm">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            Loading your orders from database...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800/60 p-8">
            <div className="w-16 h-16 bg-slate-800/80 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-500">
              <FolderKanban className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No Orders Found</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
              You don&apos;t have any active orders matching this filter. Browse available specialists or post a new job request.
            </p>
            <button
              onClick={() => router.push('/services')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 inline-flex items-center gap-2 cursor-pointer"
            >
              Browse Specialists
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 rounded-3xl p-6 transition-all shadow-xl backdrop-blur-xl relative overflow-hidden group"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/60">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400 font-bold text-lg">
                      {job.title.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {job.title}
                        </h2>
                        {getStatusBadge(job.status)}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 max-w-2xl line-clamp-2">
                        {job.description}
                      </p>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="text-right shrink-0">
                    <div className="text-xs text-slate-400">Budget</div>
                    <div className="text-xl font-extrabold text-emerald-400">
                      ${job.budget}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-slate-800/60">
                  {/* Freelancer */}
                  <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-4 flex items-center gap-3">
                    {job.freelancer_avatar ? (
                      <img
                        src={job.freelancer_avatar}
                        alt={job.freelancer_name || 'Freelancer'}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                        FL
                      </div>
                    )}
                    <div>
                      <div className="text-xs text-slate-400">Assigned Specialist</div>
                      <div className="text-sm font-semibold text-white">
                        {job.freelancer_name || 'Unassigned (Open Post)'}
                      </div>
                    </div>
                  </div>

                  {/* Attachment */}
                  <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Input Asset</div>
                        <div className="text-xs font-medium text-slate-200 truncate max-w-[140px]">
                          {job.attachments && job.attachments.length > 0 ? 'Media Asset Attached' : 'No Media Attached'}
                        </div>
                      </div>
                    </div>
                    {job.attachments && job.attachments.length > 0 && (
                      <a
                        href={job.attachments[0]}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-xs text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-4 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Created Date</div>
                      <div className="text-xs font-semibold text-slate-200">
                        {new Date(job.created_at || Date.now()).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    {job.status === 'review' ? (
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    {job.status === 'review'
                      ? 'Work has been submitted for your review!'
                      : job.status === 'completed'
                      ? 'Job marked completed.'
                      : 'Freelancer is working on your job requirements.'}
                  </span>

                  <div className="flex items-center gap-3">
                    {job.status === 'review' && (
                      <button
                        onClick={() => handleApproveJob(job)}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve Deliverable
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenChat(job)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Chat with Specialist
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Device File Upload */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">Post New Job / Project</h3>
            <p className="text-xs text-slate-400 mb-6">
              Post your job requirements to the marketplace for freelancers to apply.
            </p>

            <form onSubmit={handleCreateDeviceProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Edit TikTok Reel with Captions & Audio Mix"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Instructions & Requirements</label>
                <textarea
                  rows={3}
                  placeholder="Explain what color grading, captions, or cuts you need..."
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Budget ($ USD)</label>
                <input
                  type="number"
                  required
                  value={newProjectPrice}
                  onChange={(e) => setNewProjectPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Attach Raw Media File</label>
                <input
                  type="file"
                  accept="video/*,image/*"
                  onChange={handleFileSelect}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 file:cursor-pointer cursor-pointer bg-slate-950 rounded-xl border border-slate-800 p-2"
                />
                {selectedFile && (
                  <p className="text-[11px] text-emerald-400 mt-1">
                    ✓ Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-500/20"
                >
                  Post Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Chat Modal */}
      <MessagingWidget />
    </div>
  );
}
