'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  markConversationRead,
  fetchUnreadCount,
  fetchContacts,
  createOrFindConversation,
  type Conversation,
  type Message,
  type Contact
} from '@/lib/messaging';
import {
  uploadChatAttachment,
  formatBytes,
  getFileCategory,
  type UploadProgress
} from '@/lib/storage';
import {
  MessageCircle,
  X,
  ArrowLeft,
  Send,
  Search,
  Inbox,
  Sparkles,
  Plus,
  UserPlus,
  Paperclip,
  FileText,
  Film,
  Image as ImageIcon,
  Download,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Play
} from 'lucide-react';

// ─── Helpers ─────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'now';
  if (diffMin < 60) return `${diffMin}m`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getOtherParticipant(conv: Conversation, userId: string, userEmail?: string) {
  const isParticipant1 =
    conv.participant_1_id === userId ||
    (userEmail && conv.participant_1_id.toLowerCase() === userEmail.toLowerCase());

  if (isParticipant1) {
    return {
      id: conv.participant_2_id,
      name: conv.participant_2_name || 'User',
      avatar: conv.participant_2_avatar
    };
  }
  return {
    id: conv.participant_1_id,
    name: conv.participant_1_name || 'User',
    avatar: conv.participant_1_avatar
  };
}

function getUnreadCount(conv: Conversation, userId: string, userEmail?: string): number {
  const isParticipant1 =
    conv.participant_1_id === userId ||
    (userEmail && conv.participant_1_id.toLowerCase() === userEmail.toLowerCase());

  if (isParticipant1) return conv.unread_count_1 || 0;
  return conv.unread_count_2 || 0;
}

function AvatarBubble({ src, name, size = 40 }: { src?: string; name: string; size?: number }) {
  const [imgError, setImgError] = useState(false);
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: size, height: size }}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className="rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-white font-bold"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials || '?'}
    </div>
  );
}

// ─── Main Widget ─────────────────────────────────────────────

export default function MessagingWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'list' | 'chat' | 'contacts'>('list');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [totalUnread, setTotalUnread] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // ─── Load conversations ────────────────────────────────────
  const loadConversations = useCallback(async () => {
    if (!user?.id) return;
    setIsLoadingConversations(true);
    try {
      const convs = await fetchConversations(user.id);
      setConversations(convs);
      setFilteredConversations(convs);
    } catch (err) {
      console.error('Error loading conversations:', err);
    } finally {
      setIsLoadingConversations(false);
    }
  }, [user?.id]);

  // ─── Load unread count ─────────────────────────────────────
  const loadUnreadCount = useCallback(async () => {
    if (!user?.id) return;
    try {
      const count = await fetchUnreadCount(user.id);
      setTotalUnread(count);
    } catch (err) {
      console.error('Error loading unread count:', err);
    }
  }, [user?.id]);

  // ─── Load available contacts ──────────────────────────────
  const loadContactsList = useCallback(async () => {
    if (!user?.id) return;
    try {
      const list = await fetchContacts(user.id);
      setContacts(list);
    } catch (err) {
      console.error('Error loading contacts:', err);
    }
  }, [user?.id]);

  // ─── Load messages for a conversation ──────────────────────
  const loadMessages = useCallback(async (conversationId: string) => {
    if (!user?.id) return;
    setIsLoadingMessages(true);
    try {
      const msgs = await fetchMessages(conversationId, user.id);
      setMessages(msgs);
    } catch (err) {
      console.error('Error loading messages:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [user?.id]);

  // ─── Initial load ──────────────────────────────────────────
  useEffect(() => {
    if (user?.id) {
      loadConversations();
      loadUnreadCount();
      loadContactsList();
    }
  }, [user?.id, loadConversations, loadUnreadCount, loadContactsList]);

  // ─── Global Event Listener for open_chat ───────────────────
  useEffect(() => {
    const handleOpenChat = async (e: Event) => {
      const customEvt = e as CustomEvent<{ participant: { id: string; name: string; avatar?: string }; jobId?: string }>;
      const { participant, jobId } = customEvt.detail || {};
      if (!user || !participant?.id) return;

      setIsOpen(true);
      setIsStartingChat(true);

      const res = await createOrFindConversation(
        { id: user.id, name: user.name, avatar: user.avatar },
        { id: participant.id, name: participant.name, avatar: participant.avatar },
        jobId
      );

      setIsStartingChat(false);
      if (res.conversation) {
        openConversation(res.conversation);
      }
    };

    window.addEventListener('socialflow_open_chat', handleOpenChat);
    return () => window.removeEventListener('socialflow_open_chat', handleOpenChat);
  }, [user]);

  // ─── Supabase Realtime subscription + Active Polling Sync ───
  useEffect(() => {
    if (!user?.id) return;

    // 1. Supabase Realtime Listener
    let channel: any = null;
    if (supabase) {
      try {
        channel = supabase
          .channel(`messaging-realtime-${user.id}`)
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'messages' },
            (payload) => {
              const newMsg = payload.new as Message;

              if (selectedConversation && newMsg.conversation_id === selectedConversation.id) {
                setMessages((prev) => {
                  if (prev.some((m) => m.id === newMsg.id)) return prev;
                  return [...prev, newMsg];
                });

                if (newMsg.sender_id !== user.id) {
                  markConversationRead(selectedConversation.id, user.id);
                }
              } else {
                loadUnreadCount();
              }

              loadConversations();
            }
          )
          .subscribe();
      } catch (e) {
        console.warn('Realtime subscription fallback');
      }
    }

    // 2. High-frequency Polling Fallback (ensures 100% message delivery across multi-browser sessions)
    const pollInterval = setInterval(async () => {
      try {
        const [convs, unread] = await Promise.all([
          fetchConversations(user.id),
          fetchUnreadCount(user.id)
        ]);

        if (convs && Array.isArray(convs)) {
          setConversations(convs);
        }
        setTotalUnread(unread);

        // If inside an active conversation, fetch newest messages
        if (selectedConversation?.id && view === 'chat') {
          const freshMsgs = await fetchMessages(selectedConversation.id, user.id);
          if (freshMsgs && Array.isArray(freshMsgs)) {
            setMessages((prev) => {
              const prevIds = new Set(prev.map((m) => m.id));
              const hasDifference =
                freshMsgs.length !== prev.length ||
                freshMsgs.some((m) => !prevIds.has(m.id));

              if (hasDifference) {
                return freshMsgs;
              }
              return prev;
            });
          }
        }
      } catch (_) {}
    }, 2500);

    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
      clearInterval(pollInterval);
    };
  }, [user?.id, selectedConversation?.id, view, loadConversations, loadUnreadCount]);

  // ─── Scroll to bottom ──────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, uploadProgress]);

  // ─── Search filter ─────────────────────────────────────────
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConversations(conversations);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredConversations(
        conversations.filter((c) => {
          const other = getOtherParticipant(c, user?.id || '', user?.email);
          return (
            other.name.toLowerCase().includes(q) ||
            c.last_message_text.toLowerCase().includes(q)
          );
        })
      );
    }
  }, [searchQuery, conversations, user?.id]);

  // ─── Open conversation ─────────────────────────────────────
  const openConversation = async (conv: Conversation) => {
    setSelectedConversation(conv);
    setView('chat');
    setSelectedFile(null);
    setUploadProgress(null);
    setUploadError(null);
    await loadMessages(conv.id);
    if (user?.id) {
      await markConversationRead(conv.id, user.id);
      loadUnreadCount();
      loadConversations();
    }
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  // ─── Start conversation with contact ─────────────────────
  const startConversationWithContact = async (contact: Contact) => {
    if (!user?.id) return;
    setIsStartingChat(true);
    try {
      const res = await createOrFindConversation(
        { id: user.id, name: user.name, avatar: user.avatar },
        { id: contact.id, name: contact.name, avatar: contact.avatar }
      );
      if (res.conversation) {
        await loadConversations();
        await openConversation(res.conversation);
      }
    } catch (err) {
      console.error('Error starting conversation:', err);
    } finally {
      setIsStartingChat(false);
    }
  };

  // ─── File Selection ────────────────────────────────────────
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  // ─── Send Message (Text + File Attachment) ──────────────────
  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !selectedFile) || !selectedConversation || !user || isSending) return;

    const textContent = newMessage.trim();
    const currentFile = selectedFile;

    setNewMessage('');
    setSelectedFile(null);
    setIsSending(true);
    setUploadError(null);

    let attachmentPayload = undefined;

    // Upload attachment if present
    if (currentFile) {
      const uploadRes = await uploadChatAttachment(
        currentFile,
        selectedConversation.id,
        (progress) => setUploadProgress(progress)
      );

      if (!uploadRes.success || !uploadRes.publicUrl) {
        setUploadError(uploadRes.error || 'Failed to upload attachment');
        setIsSending(false);
        setUploadProgress(null);
        return;
      }

      attachmentPayload = {
        attachmentUrl: uploadRes.publicUrl,
        fileName: uploadRes.fileName,
        fileType: uploadRes.fileType,
        fileSize: uploadRes.fileSize,
        mimeType: uploadRes.mimeType,
        storagePath: uploadRes.storagePath
      };
    }

    // Optimistic message update
    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      conversation_id: selectedConversation.id,
      sender_id: user.id,
      sender_name: user.name,
      sender_avatar: user.avatar || '',
      content: textContent || (currentFile ? `Attachment: ${currentFile.name}` : ''),
      attachment_url: attachmentPayload?.attachmentUrl || null,
      file_name: attachmentPayload?.fileName || null,
      file_type: attachmentPayload?.fileType || null,
      file_size: attachmentPayload?.fileSize || null,
      mime_type: attachmentPayload?.mimeType || null,
      storage_path: attachmentPayload?.storagePath || null,
      is_read: false,
      created_at: new Date().toISOString()
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setUploadProgress(null);

    try {
      const sentMsg = await sendMessage(
        selectedConversation.id,
        user.id,
        user.name,
        user.avatar || '',
        textContent,
        attachmentPayload
      );
      if (sentMsg) {
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticMsg.id ? sentMsg : m))
        );
      }
      loadConversations();
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
    } finally {
      setIsSending(false);
    }
  };

  // Don't render for unauthenticated users
  if (!user) return null;

  return (
    <>
      {/* ─── Floating Chat Bubble ─────────────────────────── */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            loadConversations();
            loadUnreadCount();
            loadContactsList();
          }
        }}
        className="fixed bottom-6 right-6 z-[9999] group"
        aria-label="Open messages"
        id="messaging-bubble"
        suppressHydrationWarning
      >
        <div className={`
          w-14 h-14 rounded-full flex items-center justify-center
          bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
          shadow-lg shadow-indigo-500/30
          hover:shadow-xl hover:shadow-indigo-500/40
          hover:scale-110 active:scale-95
          transition-all duration-300 ease-out
          ${isOpen ? 'rotate-90 scale-95' : ''}
        `}>
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
        </div>

        {/* Unread badge */}
        {totalUnread > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1.5 flex items-center justify-center rounded-full bg-red-500 text-white text-[11px] font-bold shadow-lg animate-bounce">
            {totalUnread > 99 ? '99+' : totalUnread}
          </span>
        )}
      </button>

      {/* ─── Slide-Out Message Panel ──────────────────────── */}
      <div
        className={`
          fixed bottom-24 right-6 z-[9998]
          w-[390px] max-h-[580px] h-[580px]
          rounded-2xl overflow-hidden
          bg-white/95 dark:bg-slate-900/95
          backdrop-blur-xl
          border border-slate-200/50 dark:border-slate-700/50
          shadow-2xl shadow-black/20
          flex flex-col
          transition-all duration-300 ease-out origin-bottom-right
          ${isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
          }
        `}
        id="messaging-panel"
        suppressHydrationWarning
      >
        {/* ─── Panel Header ───────────────────────────────── */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 flex-shrink-0">
          {view === 'chat' && selectedConversation ? (
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={() => { setView('list'); setSelectedConversation(null); }}
                className="p-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </button>
              <AvatarBubble
                src={getOtherParticipant(selectedConversation, user.id, user.email).avatar}
                name={getOtherParticipant(selectedConversation, user.id, user.email).name}
                size={32}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {getOtherParticipant(selectedConversation, user.id, user.email).name}
                </p>
              </div>
            </div>
          ) : view === 'contacts' ? (
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={() => setView('list')}
                className="p-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </button>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Start New Chat</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Select a registered contact or freelancer</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Messages</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setView('contacts')}
                className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-xs font-bold shadow-sm hover:opacity-90 transition-all cursor-pointer"
                title="Start a new message"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Chat</span>
              </button>
            </>
          )}
        </div>

        {/* ─── View: Contacts ───────────────────────────── */}
        {view === 'contacts' && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-3 border-b border-slate-200/50 dark:border-slate-800/50">
              <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Platform Members &amp; Freelancers
              </p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-100 dark:divide-slate-800/60">
              {isStartingChat ? (
                <div className="flex items-center justify-center h-full gap-2 text-xs text-slate-400">
                  <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to chat...</span>
                </div>
              ) : contacts.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No other members found on the platform yet.
                </div>
              ) : (
                contacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => startConversationWithContact(contact)}
                    className="w-full p-3.5 flex items-center gap-3 text-left hover:bg-slate-100/70 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <AvatarBubble src={contact.avatar} name={contact.name} size={40} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{contact.name}</p>
                      <p className="text-[11px] text-indigo-600 dark:text-indigo-400 truncate mt-0.5">{contact.title || 'Platform Member'}</p>
                    </div>
                    <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* ─── View: Conversation List ────────────────────── */}
        {view === 'list' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Search */}
            <div className="px-4 py-3 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all"
                />
              </div>
            </div>

            {/* List Items */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {isLoadingConversations && conversations.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                    <span className="text-xs">Loading conversations...</span>
                  </div>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex items-center justify-center h-full px-6">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center">
                      <Inbox className="w-7 h-7 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No active chats</p>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Start a conversation with a freelancer or client.
                      </p>
                      <button
                        onClick={() => setView('contacts')}
                        className="mt-3 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-xs font-bold shadow-md hover:opacity-90 transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Start New Chat</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const other = getOtherParticipant(conv, user.id, user.email);
                  const unread = getUnreadCount(conv, user.id, user.email);
                  return (
                    <button
                      key={conv.id}
                      onClick={() => openConversation(conv)}
                      className={`
                        w-full px-4 py-3 flex items-center gap-3 text-left
                        hover:bg-slate-100/70 dark:hover:bg-slate-800/50
                        transition-colors duration-150
                        ${unread > 0 ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''}
                      `}
                    >
                      <div className="relative flex-shrink-0">
                        <AvatarBubble src={other.avatar} name={other.name} size={42} />
                        {unread > 0 && (
                          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-900" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[13px] truncate ${unread > 0 ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-200'}`}>
                            {other.name}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 flex-shrink-0">
                            {timeAgo(conv.last_message_at)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-0.5">
                          <p className={`text-[11px] truncate ${unread > 0 ? 'text-slate-700 dark:text-slate-300 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                            {conv.last_message_text || 'No messages yet'}
                          </p>
                          {unread > 0 && (
                            <span className="flex-shrink-0 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-indigo-500 text-white text-[10px] font-bold">
                              {unread > 99 ? '99+' : unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ─── View: Chat ─────────────────────────────────── */}
        {view === 'chat' && selectedConversation && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 custom-scrollbar">
              {isLoadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-3 text-center px-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Start the conversation</p>
                      <p className="text-[11px] text-slate-400 mt-1">Send a message or attach a project file 👋</p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, idx) => {
                    const isMine = msg.sender_id === user.id;
                    const showAvatar = idx === 0 || messages[idx - 1].sender_id !== msg.sender_id;

                    return (
                      <div
                        key={msg.id}
                        className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : ''} ${showAvatar ? 'mt-3' : 'mt-0.5'}`}
                      >
                        <div className="flex-shrink-0 w-6">
                          {showAvatar && !isMine && (
                            <AvatarBubble
                              src={msg.sender_avatar}
                              name={msg.sender_name}
                              size={24}
                            />
                          )}
                        </div>

                        {/* Content Container */}
                        <div className={`max-w-[80%] flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                          {/* Text Message */}
                          {msg.content && (
                            <div
                              className={`
                                px-3.5 py-2 rounded-2xl text-[12.5px] leading-relaxed break-words
                                ${isMine
                                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-md shadow-sm'
                                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-bl-md border border-slate-200/50 dark:border-slate-700/50'
                                }
                              `}
                            >
                              {msg.content}
                            </div>
                          )}

                          {/* File Attachment Render */}
                          {msg.attachment_url && (
                            <div className="mt-1.5 max-w-full">
                              {msg.file_type === 'image' ? (
                                <a
                                  href={msg.attachment_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="block overflow-hidden rounded-2xl border border-slate-700/40 hover:opacity-95 transition-opacity"
                                >
                                  <img
                                    src={msg.attachment_url}
                                    alt={msg.file_name || 'Attachment'}
                                    className="max-h-48 w-full object-cover rounded-2xl"
                                  />
                                </a>
                              ) : msg.file_type === 'video' ? (
                                <div className="rounded-2xl overflow-hidden border border-slate-700/60 bg-black/90 p-1">
                                  <video
                                    controls
                                    src={msg.attachment_url}
                                    className="w-full max-h-52 rounded-xl object-cover"
                                  />
                                  <div className="px-2 py-1 flex items-center justify-between text-[10px] text-slate-400">
                                    <span className="truncate max-w-[160px]">{msg.file_name || 'Video Attachment'}</span>
                                    <span>{msg.file_size ? formatBytes(msg.file_size) : ''}</span>
                                  </div>
                                </div>
                              ) : (
                                <a
                                  href={msg.attachment_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/80 border border-slate-700 hover:bg-slate-800 transition-all text-slate-200 text-xs shadow-md"
                                >
                                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                                    <FileText className="w-5 h-5" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-white truncate max-w-[150px]">{msg.file_name || 'Document File'}</p>
                                    <p className="text-[10px] text-slate-400">{msg.file_size ? formatBytes(msg.file_size) : 'File'}</p>
                                  </div>
                                  <Download className="w-4 h-4 text-slate-400 hover:text-white shrink-0" />
                                </a>
                              )}
                            </div>
                          )}

                          <span className="text-[9px] text-slate-400 mt-1 px-1">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Active Upload Progress Card */}
                  {uploadProgress && (
                    <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl space-y-1.5 animate-pulse">
                      <div className="flex items-center justify-between text-xs font-semibold text-indigo-300">
                        <span className="flex items-center gap-1.5">
                          <Film className="w-3.5 h-3.5 text-indigo-400" />
                          Uploading Media Attachment...
                        </span>
                        <span>{uploadProgress.percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-200"
                          style={{ width: `${uploadProgress.percentage}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-400 text-right">
                        {formatBytes(uploadProgress.bytesUploaded)} / {formatBytes(uploadProgress.totalBytes)}
                      </div>
                    </div>
                  )}

                  {uploadError && (
                    <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Bar */}
            <div className="px-4 py-3 border-t border-slate-200/60 dark:border-slate-700/60 flex-shrink-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              {/* Selected File Badge Preview */}
              {selectedFile && (
                <div className="mb-2 p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-between text-xs text-indigo-300">
                  <div className="flex items-center gap-2 truncate">
                    <Paperclip className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate font-semibold">{selectedFile.name}</span>
                    <span className="text-[10px] text-slate-400">({formatBytes(selectedFile.size)})</span>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <form
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="flex items-center gap-2"
              >
                {/* File Attachment Button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all"
                  title="Attach video, image, or document"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a message or attach a file..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all"
                  disabled={isSending}
                />

                <button
                  type="submit"
                  disabled={(!newMessage.trim() && !selectedFile) || isSending}
                  className={`
                    w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                    transition-all duration-200
                    ${(newMessage.trim() || selectedFile)
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95 cursor-pointer'
                      : 'bg-slate-100 dark:bg-slate-800/60 text-slate-400 cursor-not-allowed'
                    }
                  `}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
