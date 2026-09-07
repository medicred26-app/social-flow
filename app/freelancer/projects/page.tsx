'use client';

import React, { useState, useEffect } from 'react';
import { 
  FolderKanban, 
  Upload, 
  CheckCircle2, 
  Clock, 
  Briefcase, 
  FileText, 
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Trash2,
  X,
  FileCheck,
  Sparkles
} from 'lucide-react';
import { Project } from '@/types';
import { getStoredClientProjects, saveStoredClientProjects } from '@/lib/store';

export default function FreelancerProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Deliverable Submission Form State
  const [deliverableTitle, setDeliverableTitle] = useState('Final Short-Form Video Asset (9:16)');
  const [deliverableMediaUrl, setDeliverableMediaUrl] = useState('https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80');
  const [deliverableCaption, setDeliverableCaption] = useState('🔥 Dynamic content reel ready for Instagram & TikTok!');
  const [deliverableHashtags, setDeliverableHashtags] = useState('#SocialFlow #ContentCreator #ViralEdit');
  const [deliverableNotes, setDeliverableNotes] = useState('Rendered in 4K 60fps with custom color grading and viral typography.');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notif, setNotif] = useState<string | null>(null);

  // Delete modal state
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  useEffect(() => {
    setProjects(getStoredClientProjects());
  }, []);

  const handleDeviceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setDeliverableMediaUrl(url);
    }
  };

  const handleSubmitDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;

    const hashtagsArr = deliverableHashtags.split(' ').map(t => t.trim()).filter(Boolean);

    const updatedProjects = projects.map(p => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          status: 'review_requested' as const,
          deliverable: {
            id: `deliv-${Date.now()}`,
            title: deliverableTitle,
            mediaUrl: deliverableMediaUrl,
            mediaType: (selectedFile?.type.startsWith('image/') ? 'image' : 'video') as 'image' | 'video',
            captionSuggestion: deliverableCaption,
            hashtagsSuggestion: hashtagsArr,
            notes: deliverableNotes,
            submittedAt: new Date().toISOString()
          }
        };
      }
      return p;
    });

    setProjects(updatedProjects);
    saveStoredClientProjects(updatedProjects);
    setActiveProject(null);
    setSelectedFile(null);

    setNotif(`🚀 Deliverable submitted for "${activeProject.title}"! Client has been notified for review.`);
    setTimeout(() => setNotif(null), 4000);
  };

  const handleDeleteProject = (projectId: string) => {
    const updated = projects.filter(p => p.id !== projectId);
    setProjects(updated);
    saveStoredClientProjects(updated);
    setDeletingProjectId(null);
    setNotif('🗑️ Project removed from your freelancer dashboard.');
    setTimeout(() => setNotif(null), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg shadow-indigo-500/20">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Active Freelancer Projects</span>
              <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full border border-purple-500/20">
                {projects.length} Active
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track project milestones, upload final deliverables directly from device, and manage client orders.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>Auto Escrow Release on Approval</span>
        </div>
      </div>

      {notif && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notif}</span>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="py-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3 shadow-xl">
            <FolderKanban className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No active projects yet</p>
            <p className="text-xs text-slate-400">Browse the Live Jobs board to apply and get hired by top clients.</p>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 hover:border-indigo-500/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      project.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : project.status === 'review_requested'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                    }`}>
                      {project.status === 'completed' ? '✓ Completed & Paid' : project.status === 'review_requested' ? '⏳ Under Client Review' : '🔨 Work In Progress'}
                    </span>
                    <span className="text-[11px] text-slate-400">Client: {project.clientName}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                    {project.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 block">
                      Net: ₹{project.freelancerEarnings.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Gross: ₹{project.price.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={() => setDeletingProjectId(project.id)}
                    title="Remove Project"
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {project.description}
              </p>

              {/* Deliverable Preview if submitted */}
              {project.deliverable && (
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Submitted Deliverable Asset
                    </span>
                    <span className="text-[10px] text-slate-400">Submitted {new Date(project.deliverable.submittedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{project.deliverable.title}</p>
                  {project.deliverable.captionSuggestion && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      {project.deliverable.captionSuggestion}
                    </p>
                  )}
                  {project.deliverable.notes && (
                    <p className="text-[11px] text-indigo-500 italic">Notes: {project.deliverable.notes}</p>
                  )}
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Created: <span className="font-semibold text-slate-600 dark:text-slate-300">{new Date(project.createdAt).toLocaleDateString()}</span>
                </span>

                {project.status !== 'completed' && (
                  <button
                    onClick={() => setActiveProject(project)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{project.deliverable ? 'Update Deliverable' : 'Upload Deliverable from Device'}</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Deliverable Submission Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Upload Deliverable for "{activeProject.title}"
                </h3>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Select file from device or provide asset URL</p>
              </div>
              <button
                onClick={() => setActiveProject(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitDeliverable} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Deliverable Title
                </label>
                <input
                  type="text"
                  required
                  value={deliverableTitle}
                  onChange={(e) => setDeliverableTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Deliverable Media File from Device
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-purple-500 rounded-2xl p-4 text-center bg-slate-50 dark:bg-slate-950 transition-all">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleDeviceFileChange}
                    className="hidden"
                    id="freelancer-file-input"
                  />
                  <label htmlFor="freelancer-file-input" className="cursor-pointer space-y-2 block">
                    <Upload className="w-8 h-8 text-purple-500 mx-auto" />
                    {selectedFile ? (
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{selectedFile.name}</p>
                        <p className="text-[10px] text-emerald-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Click to upload final video edit or graphic image</p>
                        <p className="text-[10px] text-slate-400">MP4, MOV, PNG, JPG file up to 500MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Suggested Caption Body
                </label>
                <textarea
                  rows={3}
                  value={deliverableCaption}
                  onChange={(e) => setDeliverableCaption(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Suggested Hashtags
                </label>
                <input
                  type="text"
                  value={deliverableHashtags}
                  onChange={(e) => setDeliverableHashtags(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveProject(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Submit Deliverable to Client</span>
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
              Are you sure you want to remove this project from your list?
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
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
