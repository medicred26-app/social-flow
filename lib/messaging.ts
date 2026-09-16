export interface Conversation {
  id: string;
  participant_1_id: string;
  participant_1_name: string;
  participant_1_avatar: string;
  participant_2_id: string;
  participant_2_name: string;
  participant_2_avatar: string;
  last_message_text: string;
  last_message_at: string;
  unread_count_1: number;
  unread_count_2: number;
  job_id?: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar: string;
  content: string;
  attachment_url?: string | null;
  file_name?: string | null;
  file_type?: 'image' | 'video' | 'pdf' | 'document' | null;
  file_size?: number | null;
  mime_type?: string | null;
  storage_path?: string | null;
  is_read: boolean;
  created_at: string;
}

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

/**
 * Fetch all conversations for a user
 */
export async function fetchConversations(userId: string): Promise<Conversation[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/messages/conversations?userId=${encodeURIComponent(userId)}`);
    const data = await res.json();
    return data.conversations || [];
  } catch (e) {
    console.error('Failed to fetch conversations:', e);
    return [];
  }
}

/**
 * Fetch all messages for a conversation (also marks them as read)
 */
export async function fetchMessages(conversationId: string, userId: string): Promise<Message[]> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/messages/conversations/${conversationId}/messages?userId=${encodeURIComponent(userId)}`
    );
    const data = await res.json();
    return data.messages || [];
  } catch (e) {
    console.error('Failed to fetch messages:', e);
    return [];
  }
}

/**
 * Send a text message or attachment message
 */
export async function sendMessage(
  conversationId: string,
  senderId: string,
  senderName: string,
  senderAvatar: string,
  content: string,
  attachmentPayload?: {
    attachmentUrl?: string;
    fileName?: string;
    fileType?: 'image' | 'video' | 'pdf' | 'document';
    fileSize?: number;
    mimeType?: string;
    storagePath?: string;
  }
): Promise<Message | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/messages/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId,
        senderId,
        senderName,
        senderAvatar,
        content,
        attachmentUrl: attachmentPayload?.attachmentUrl,
        fileName: attachmentPayload?.fileName,
        fileType: attachmentPayload?.fileType,
        fileSize: attachmentPayload?.fileSize,
        mimeType: attachmentPayload?.mimeType,
        storagePath: attachmentPayload?.storagePath
      })
    });
    const data = await res.json();
    return data.message || null;
  } catch (e) {
    console.error('Failed to send message:', e);
    return null;
  }
}

/**
 * Create or find existing conversation between two users
 */
export async function createOrFindConversation(
  participant1: Participant,
  participant2: Participant,
  jobId?: string
): Promise<{ conversation: Conversation | null; existing: boolean }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/messages/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participant1, participant2, jobId })
    });
    const data = await res.json();
    return { conversation: data.conversation || null, existing: data.existing || false };
  } catch (e) {
    console.error('Failed to create/find conversation:', e);
    return { conversation: null, existing: false };
  }
}

/**
 * Mark all messages in a conversation as read for a user
 */
export async function markConversationRead(conversationId: string, userId: string): Promise<void> {
  try {
    await fetch(`${BACKEND_URL}/api/messages/mark-read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId, userId })
    });
  } catch (e) {
    console.error('Failed to mark conversation as read:', e);
  }
}

export interface Contact {
  id: string;
  name: string;
  avatar?: string;
  title?: string;
}

/**
 * Fetch available contacts to start conversation
 */
export async function fetchContacts(currentUserId?: string): Promise<Contact[]> {
  try {
    const query = currentUserId ? `?userId=${encodeURIComponent(currentUserId)}` : '';
    const res = await fetch(`${BACKEND_URL}/api/messages/contacts${query}`);
    const data = await res.json();
    return data.contacts || [];
  } catch (e) {
    console.error('Failed to fetch contacts:', e);
    return [];
  }
}

/**
 * Get total unread count across all conversations
 */
export async function fetchUnreadCount(userId: string): Promise<number> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/messages/unread-count?userId=${encodeURIComponent(userId)}`);
    const data = await res.json();
    return data.count || 0;
  } catch (e) {
    console.error('Failed to fetch unread count:', e);
    return 0;
  }
}
