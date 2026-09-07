'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  FolderPlus, 
  Send, 
  User, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  Upload,
  Trash2,
  X,
  ExternalLink,
  Plus,
  Play,
  FileCheck
} from 'lucide-react';
import { Project, ContentItem } from '@/types';
import { getStoredClientProjects, saveStoredClientProjects, getStoredLibraryItems, saveStoredLibraryItems } from '@/lib/store';

export default function CustomerProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [notif, setNotif] = useState<string | null>(null);

  // New Device File Upload Project State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectPrice, setNewProjectPrice] = useState('500');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  // Delete confirmation state
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  useEffect(() => {
    setProjects(getStoredClientProjects());
  }, []);

  // Handle local file selection from device
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    }
  };

  // Create new project from local device file
  const handleCreateDeviceProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;

    const mediaUrl = filePreviewUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
    const isVideo = selectedFile?.type.startsWith('video/') || false;

    const newProject: Project = {
      id: `proj-device-${Date.now()}`,
      title: newProjectTitle,
      description: newProjectDesc || 'Uploaded from local device for freelancer processing.',
      category: 'video_editing',
      clientId: 'cust-1',
      clientName: 'You (Client)',
      freelancerId: 'fl-1',
      freelancerName: 'Assigned Freelancer',
      freelancerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      price: parseInt(newProjectPrice, 10) || 500,
      platformFee: (parseInt(newProjectPrice, 10) || 500) * 0.15,
      freelancerEarnings: (parseInt(newProjectPrice, 10) || 500) * 0.85,
      status: 'in_progress',
      attachedMedia: [
        {
          id: `m-device-${Date.now()}`,
          url: mediaUrl,
          type: isVideo ? 'video' : 'image',
          name: selectedFile?.name || 'device_asset.mp4',
          size: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '12 MB'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);
    saveStoredClientProjects(updatedProjects);

    setShowUploadModal(false);
    setNewProjectTitle('');
    setNewProjectDesc('');
    setSelectedFile(null);
    setFilePreviewUrl(null);

    setNotif(`🚀 Project "${newProject.title}" uploaded from device and created successfully!`);
    setTimeout(() => setNotif(null), 4000);
  };

  // Delete project handler
  const handleDeleteProject = (projectId: string) => {
    const updated = projects.filter(p => p.id !== projectId);
    setProjects(updated);
    saveStoredClientProjects(updated);
    setDeletingProjectId(null);
    setNotif('🗑️ Project deleted successfully.');
    setTimeout(() => setNotif(null), 3000);
  };

  const handleApproveProject = (project: Project) => {
    const updated = projects.map(p => {
      if (p.id === project.id) return { ...p, status: 'completed' as const };
      return p;
    });
    setProjects(updated);
    saveStoredClientProjects(updated);

    if (project.deliverable) {
      const newLibItem: ContentItem = {
        id: `lib-freelancer-${Date.now()}`,
        title: project.deliverable.title || project.title,
        description: project.deliverable.notes,
        media: [
          {
            id: `m-deliv-${Date.now()}`,
            url: project.deliverable.mediaUrl,
            type: project.deliverable.mediaType,
            name: `${project.title.toLowerCase().replace(/\s+/g, '_')}.mp4`,
            size: '18.6 MB'
          }
        ],
        thumbnailUrl: project.deliverable.thumbnailUrl,
        caption: project.deliverable.captionSuggestion || '',
        hashtags: project.deliverable.hashtagsSuggestion || ['#FreelancerWork', '#SocialFlow'],
        contentType: project.deliverable.mediaType,
        creationSource: 'freelancer_delivered',
        status: 'ready',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        associatedProjectId: project.id
      };

      const currentLib = getStoredLibraryItems();
      saveStoredLibraryItems([newLibItem, ...currentLib]);
    }

    setNotif(`✨ Approved work for "${project.title}"! Added deliverable to Content Library.`);
    setTimeout(() => setNotif(null), 3000);
  };

  const handleSendToPublisher = (project: Project) => {
    if (project.deliverable) {
      const payload = {
        title: project.deliverable.title,
        mediaUrl: project.deliverable.mediaUrl,
        thumbnailUrl: project.deliverable.thumbnailUrl || '',
        caption: project.deliverable.captionSuggestion || '',
        hashtags: project.deliverable.hashtagsSuggestion || []
      };
      sessionStorage.setItem('socialflow_studio_draft', JSON.stringify(payload));
    }
    router.push('/compose?fromProject=true');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg shadow-indigo-500/20">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Marketplace Projects
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track project progress, review freelancer deliverables, upload local device files &amp; publish work
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Device Project File</span>
          </button>

          <button
            onClick={() => router.push('/services')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>Hire Freelancer</span>
          </button>
        </div>
      </div>

      {notif && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notif}</span>
        </div>
      )}

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
          <ClipboardList className="w-12 h-12 text-slate-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No active projects</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Upload project assets from your local device or hire a freelancer to start a new project.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload File from Device</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 hover:border-purple-500/30 transition-all"
            >
              {/* Project Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={project.freelancerAvatar}
                    alt={project.freelancerName}
                    className="w-10 h-10 rounded-xl object-cover border border-purple-500/30"
                  />
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Freelancer: <span className="font-semibold text-purple-600 dark:text-purple-400">{project.freelancerName}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    project.status === 'completed'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : project.status === 'in_progress'
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  }`}>
                    {project.status === 'completed' ? '✓ Completed' : project.status === 'in_progress' ? '⏳ In Progress' : 'Review Requested'}
                  </span>

                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    ₹{project.price.toLocaleString()}
                  </span>

                  {/* Delete Project Button */}
                  <button
                    onClick={() => setDeletingProjectId(project.id)}
                    title="Delete Project"
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {project.description}
              </p>

              {/* Attached Device Media */}
              {project.attachedMedia && project.attachedMedia.length > 0 && (
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Attached Device Assets ({project.attachedMedia.length})
                  </span>
                  <div className="flex items-center gap-3">
                    {project.attachedMedia.map((m) => (
                      <div key={m.id} className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-xl text-xs">
                        <FileCheck className="w-4 h-4 text-purple-500" />
                        <span className="font-semibold text-slate-900 dark:text-white">{m.name}</span>
                        <span className="text-[10px] text-slate-400">({m.size})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Deliverable Section (If Freelancer Submitted) */}
              {project.deliverable ? (
                <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      <span>Freelancer Deliverable Ready For Review</span>
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Submitted on {new Date(project.deliverable.submittedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                      <img
                        src={project.deliverable.thumbnailUrl || project.deliverable.mediaUrl}
                        alt="Deliverable preview"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2 text-xs">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{project.deliverable.title}</p>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                        {project.deliverable.captionSuggestion || 'No caption body provided.'}
                      </p>
                      {project.deliverable.hashtagsSuggestion && (
                        <div className="flex flex-wrap gap-1">
                          {project.deliverable.hashtagsSuggestion.map((tag, idx) => (
                            <span key={idx} className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {project.deliverable.notes && (
                        <p className="text-[11px] text-indigo-600 dark:text-indigo-400 italic pt-1">
                          Delivery Notes: {project.deliverable.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions for Approved / Pending Deliverable */}
                  <div className="pt-3 flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800/80">
                    {project.status !== 'completed' && (
                      <button
                        onClick={() => handleApproveProject(project)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve Work &amp; Add to Content Library</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleSendToPublisher(project)}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send to Social Publisher</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Freelancer is currently working on this project deliverable.</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Device File Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Upload Device Project File
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDeviceProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brand Promo Video Edit (Reels)"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select File from Computer / Device
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-emerald-500 rounded-2xl p-4 text-center bg-slate-50 dark:bg-slate-950 transition-all">
                  <input
                    type="file"
                    accept="image/*,video/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="device-file-input"
                  />
                  <label htmlFor="device-file-input" className="cursor-pointer space-y-2 block">
                    <Upload className="w-8 h-8 text-emerald-500 mx-auto" />
                    {selectedFile ? (
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{selectedFile.name}</p>
                        <p className="text-[10px] text-emerald-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Click to choose image/video file from device</p>
                        <p className="text-[10px] text-slate-400">MP4, MOV, PNG, JPG, or PDF up to 500MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Instructions &amp; Freelancer Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe desired video editing, captions, color grading, or formatting instructions..."
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload &amp; Create Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProjectId && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-500">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Delete Project?</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Are you sure you want to remove this project? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingProjectId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProject(deletingProjectId)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md transition-all"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
