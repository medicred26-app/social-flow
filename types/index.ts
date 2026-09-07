export type SocialPlatform = 'facebook' | 'instagram' | 'youtube' | 'linkedin' | 'x';

export type PostStatus = 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed';

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  name: string;
  handle: string;
  avatarUrl: string;
  connected: boolean;
  connectedAt?: string;
  followerCount?: number;
  accountType?: 'page' | 'profile' | 'channel' | 'business';
}

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  name: string;
  size?: string;
}

export interface PostTarget {
  platform: SocialPlatform;
  accountId: string;
  status: 'pending' | 'published' | 'failed';
  publishedAt?: string;
  error?: string;
  platformPostId?: string;
}

export interface Post {
  id: string;
  caption: string;
  media: MediaItem[];
  targets: PostTarget[];
  scheduledFor: string; // ISO String
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
  analytics?: {
    impressions?: number;
    likes?: number;
    shares?: number;
    comments?: number;
    clicks?: number;
  };
}

export interface PlatformLimit {
  maxCharacters: number;
  supportedMedia: ('image' | 'video')[];
  maxImages: number;
  displayName: string;
  brandColor: string;
  bgGradient: string;
}

export interface EngagementMetric {
  date: string;
  impressions: number;
  engagements: number;
  clicks: number;
  shares: number;
}

export type ContentSource = 'ai_generated' | 'user_upload' | 'edited' | 'freelancer_delivered';
export type ContentType = 'video' | 'image' | 'text' | 'repurposed_package';

export interface PlatformVariant {
  platform: SocialPlatform;
  caption: string;
  hashtags: string[];
  aspectRatio?: '9:16' | '16:9' | '1:1' | '4:5';
}

export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  media: MediaItem[];
  thumbnailUrl?: string;
  caption: string;
  hashtags: string[];
  contentType: ContentType;
  creationSource: ContentSource;
  status: 'draft' | 'ready' | 'scheduled' | 'published';
  createdAt: string;
  updatedAt: string;
  publishingStatus?: string;
  platformVariants?: PlatformVariant[];
  associatedProjectId?: string;
}

export type ServiceCategory = 
  | 'video_editing'
  | 'graphic_design'
  | 'thumbnail_design'
  | 'seo_specialist'
  | 'social_media_manager'
  | 'content_writing'
  | 'motion_graphics'
  | 'ai_automation'
  | 'web_design';

export interface FreelancerProfile {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  title: string;
  bio: string;
  skills: string[];
  categories: ServiceCategory[];
  rating: number;
  reviewCount: number;
  startingPrice: number;
  deliveryTimeDays: number;
  revisionPolicy: string;
  availability: 'available' | 'busy' | 'offline';
  portfolio: { title: string; imageUrl: string; description?: string }[];
}

export interface ServiceItem {
  id: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar: string;
  title: string;
  category: ServiceCategory;
  description: string;
  price: number;
  deliveryDays: number;
  revisions: number;
  rating: number;
}

export type ProjectStatus = 'pending' | 'in_progress' | 'review_requested' | 'completed' | 'cancelled';

export interface ProjectDeliverable {
  id: string;
  title: string;
  mediaUrl: string;
  mediaType: 'video' | 'image';
  thumbnailUrl?: string;
  captionSuggestion?: string;
  hashtagsSuggestion?: string[];
  notes?: string;
  submittedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  clientId: string;
  clientName: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar: string;
  price: number;
  platformFee: number;
  freelancerEarnings: number;
  status: ProjectStatus;
  attachedMedia?: MediaItem[];
  deliverable?: ProjectDeliverable;
  createdAt: string;
  updatedAt: string;
}

export interface CommissionConfig {
  percentage: number; // e.g. 15 for 15%
}

