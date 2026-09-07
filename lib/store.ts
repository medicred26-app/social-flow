import { Post, SocialAccount, SocialPlatform, MediaItem } from '@/types';
import { INITIAL_MOCK_ACCOUNTS } from './constants';

const STORAGE_KEY_POSTS = 'socialflow_posts_v1';
const STORAGE_KEY_ACCOUNTS = 'socialflow_accounts_v1';

const INITIAL_MOCK_POSTS: Post[] = [
  {
    id: 'post-1',
    caption: '🚀 Excited to announce our newest product update! Custom analytics and automated multi-platform queue management are now live in SocialFlow. Check out the link in bio for full details! #SaaS #BuildInPublic #Productivity',
    media: [
      {
        id: 'm-1',
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
        type: 'image',
        name: 'dashboard-preview.png',
        size: '1.2 MB'
      }
    ],
    targets: [
      { platform: 'x', accountId: 'acc-x-1', status: 'published', publishedAt: '2026-08-19T14:00:00Z', platformPostId: 'tw-109283' },
      { platform: 'linkedin', accountId: 'acc-li-1', status: 'published', publishedAt: '2026-08-19T14:00:00Z', platformPostId: 'li-992102' },
      { platform: 'facebook', accountId: 'acc-fb-1', status: 'published', publishedAt: '2026-08-19T14:00:00Z', platformPostId: 'fb-448201' }
    ],
    scheduledFor: '2026-08-19T14:00:00Z',
    status: 'published',
    createdAt: '2026-08-18T10:00:00Z',
    updatedAt: '2026-08-19T14:00:00Z',
    userId: 'user-demo',
    analytics: {
      impressions: 4820,
      likes: 312,
      shares: 48,
      comments: 29,
      clicks: 184
    }
  },
  {
    id: 'post-2',
    caption: '💡 Quick tip for content creators: Consistency > Perfection. Batch your content scheduling once a week to free up focus time for deep work. What is your favorite scheduling strategy?',
    media: [
      {
        id: 'm-2',
        url: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&auto=format&fit=crop&q=80',
        type: 'image',
        name: 'productivity-tip.jpg',
        size: '840 KB'
      }
    ],
    targets: [
      { platform: 'instagram', accountId: 'acc-ig-1', status: 'pending' },
      { platform: 'x', accountId: 'acc-x-1', status: 'pending' }
    ],
    scheduledFor: '2026-08-21T16:30:00Z',
    status: 'scheduled',
    createdAt: '2026-08-20T09:00:00Z',
    updatedAt: '2026-08-20T09:00:00Z',
    userId: 'user-demo'
  },
  {
    id: 'post-3',
    caption: 'Behind the scenes video walkthrough of how our scheduling engine processes hundreds of social targets per minute seamlessly! 🍿🎬',
    media: [],
    targets: [
      { platform: 'linkedin', accountId: 'acc-li-1', status: 'pending' },
      { platform: 'facebook', accountId: 'acc-fb-1', status: 'pending' }
    ],
    scheduledFor: '2026-08-22T11:00:00Z',
    status: 'scheduled',
    createdAt: '2026-08-20T12:00:00Z',
    updatedAt: '2026-08-20T12:00:00Z',
    userId: 'user-demo'
  }
];

export function getStoredPosts(): Post[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_POSTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_POSTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(INITIAL_MOCK_POSTS));
      return INITIAL_MOCK_POSTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load posts from storage', e);
    return INITIAL_MOCK_POSTS;
  }
}

export function saveStoredPosts(posts: Post[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
  } catch (e) {
    console.error('Failed to save posts to storage', e);
  }
}

export function getStoredAccounts(): SocialAccount[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_ACCOUNTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(INITIAL_MOCK_ACCOUNTS));
      return INITIAL_MOCK_ACCOUNTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load accounts from storage', e);
    return INITIAL_MOCK_ACCOUNTS;
  }
}

export function saveStoredAccounts(accounts: SocialAccount[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to save accounts to storage', e);
  }
}

// STORAGE KEYS & MOCKS FOR PLATFORM EXPANSION
const STORAGE_KEY_LIBRARY = 'socialflow_library_v1';
const STORAGE_KEY_FREELANCERS = 'socialflow_freelancers_v1';
const STORAGE_KEY_CLIENT_PROJECTS = 'socialflow_projects_v1';

import { ContentItem, FreelancerProfile, Project } from '@/types';

export const INITIAL_MOCK_LIBRARY: ContentItem[] = [
  {
    id: 'lib-1',
    title: 'AI Product Launch Promo Reel',
    description: 'High-energy 9:16 vertical video showcasing new SocialFlow automation features.',
    media: [
      {
        id: 'm-lib-1',
        url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
        type: 'video',
        name: 'ai_product_promo.mp4',
        size: '14.2 MB'
      }
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    caption: '🚀 Transform your social media workflow with AI Content Studio! Generate viral videos, auto-captioning, and instant multi-platform scheduling.',
    hashtags: ['#SocialMediaAutomation', '#ContentCreator', '#AIStudio', '#BuildInPublic'],
    contentType: 'video',
    creationSource: 'ai_generated',
    status: 'ready',
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-02T14:30:00Z',
    platformVariants: [
      { platform: 'instagram', caption: '🚀 Instant AI Reels generator is live! #ReelsViral', hashtags: ['#Reels', '#AI'] },
      { platform: 'youtube', caption: 'Transform your channel with automated video editing & thumbnails.', hashtags: ['#Shorts', '#YouTubeAutomation'] }
    ]
  },
  {
    id: 'lib-2',
    title: 'Minimalist Tech Design Carousel',
    description: 'Custom graphics delivered by top freelance designer Marcus Vance.',
    media: [
      {
        id: 'm-lib-2',
        url: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&auto=format&fit=crop&q=80',
        type: 'image',
        name: 'tech_carousel_01.png',
        size: '2.4 MB'
      }
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=400&auto=format&fit=crop&q=80',
    caption: '💡 5 design rules for high-converting social media carousels in 2026.',
    hashtags: ['#GraphicDesign', '#UIUX', '#SocialMediaMarketing'],
    contentType: 'image',
    creationSource: 'freelancer_delivered',
    status: 'ready',
    createdAt: '2026-09-03T11:15:00Z',
    updatedAt: '2026-09-04T09:20:00Z',
    associatedProjectId: 'proj-101'
  }
];

export const INITIAL_MOCK_FREELANCERS: FreelancerProfile[] = [
  {
    id: 'free-1',
    name: 'Marcus Vance',
    handle: '@marcusvance_creative',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    title: 'Senior Short-Form Video Editor & Motion Designer',
    bio: 'Specializing in viral TikToks, Instagram Reels, and YouTube Shorts. 6+ years editing for top tech startups & creators.',
    skills: ['Premiere Pro', 'After Effects', 'AI Video Trimming', 'Color Grading', 'Sound Design'],
    categories: ['video_editing', 'motion_graphics'],
    rating: 4.9,
    reviewCount: 48,
    startingPrice: 4500,
    deliveryTimeDays: 2,
    revisionPolicy: '2 free revisions included with every order',
    availability: 'available',
    portfolio: [
      { title: 'SaaS Launch Promo Reel', imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&auto=format&fit=crop&q=80', description: 'Dynamic video edit with custom motion typography' },
      { title: 'Podcast Highlights Reel', imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&auto=format&fit=crop&q=80', description: 'Auto captions with animated highlight text' }
    ]
  },
  {
    id: 'free-2',
    name: 'Elena Rostova',
    handle: '@elena_designs',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    title: 'High-CTR YouTube & Social Thumbnail Specialist',
    bio: 'Creating eye-catching, high-converting social media thumbnails and graphic assets designed for maximum click-through rates.',
    skills: ['Photoshop', 'Figma', 'AI Background Removal', 'Brand Identity'],
    categories: ['thumbnail_design', 'graphic_design'],
    rating: 5.0,
    reviewCount: 62,
    startingPrice: 2500,
    deliveryTimeDays: 1,
    revisionPolicy: 'Unlimited minor revisions',
    availability: 'available',
    portfolio: [
      { title: 'Tech Review Thumbnail Suite', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80', description: 'Vibrant contrast 3D thumbnail set' }
    ]
  },
  {
    id: 'free-3',
    name: 'David Chen',
    handle: '@david_seo_expert',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    title: 'Social Media SEO & Growth Strategist',
    bio: 'Helping channels rank #1 on YouTube and X search through data-driven keyword research, hook optimization, and metadata framing.',
    skills: ['YouTube SEO', 'Keyword Research', 'Social Analytics', 'Copywriting'],
    categories: ['seo_specialist', 'social_media_manager'],
    rating: 4.8,
    reviewCount: 34,
    startingPrice: 6000,
    deliveryTimeDays: 3,
    revisionPolicy: '1 revision with comprehensive analytics report',
    availability: 'available',
    portfolio: [
      { title: 'YouTube SEO Case Study', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=80', description: '+340% organic impressions boost in 30 days' }
    ]
  }
];

export const INITIAL_MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-101',
    title: 'Viral Reel Edit & Captions Pack',
    description: 'Transform raw podcast clip into 9:16 Reel with custom captions and color grading.',
    category: 'video_editing',
    clientId: 'user-demo',
    clientName: 'Alex Morgan',
    freelancerId: 'free-1',
    freelancerName: 'Marcus Vance',
    freelancerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    price: 10000,
    platformFee: 1500,
    freelancerEarnings: 8500,
    status: 'completed',
    deliverable: {
      id: 'deliv-1',
      title: 'Final Edited Video & Captions',
      mediaUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
      mediaType: 'video',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
      captionSuggestion: '🔥 Stop wasting time editing raw videos manually! Here is the AI + Human hybrid formula.',
      hashtagsSuggestion: ['#VideoEditing', '#ReelsTips', '#SocialFlow'],
      notes: 'Included 9:16 vertical version with burned-in subtitles.',
      submittedAt: '2026-09-04T09:00:00Z'
    },
    createdAt: '2026-09-02T08:00:00Z',
    updatedAt: '2026-09-04T09:20:00Z'
  }
];

export function getStoredLibraryItems(): ContentItem[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_LIBRARY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LIBRARY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(INITIAL_MOCK_LIBRARY));
      return INITIAL_MOCK_LIBRARY;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_MOCK_LIBRARY;
  }
}

export function saveStoredLibraryItems(items: ContentItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(items));
  } catch (e) {}
}

export function getStoredFreelancers(): FreelancerProfile[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_FREELANCERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FREELANCERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_FREELANCERS, JSON.stringify(INITIAL_MOCK_FREELANCERS));
      return INITIAL_MOCK_FREELANCERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_MOCK_FREELANCERS;
  }
}

export function saveStoredFreelancers(freelancers: FreelancerProfile[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_FREELANCERS, JSON.stringify(freelancers));
  } catch (e) {}
}

export function getStoredClientProjects(): Project[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_PROJECTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CLIENT_PROJECTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CLIENT_PROJECTS, JSON.stringify(INITIAL_MOCK_PROJECTS));
      return INITIAL_MOCK_PROJECTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_MOCK_PROJECTS;
  }
}

export function saveStoredClientProjects(projects: Project[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_CLIENT_PROJECTS, JSON.stringify(projects));
  } catch (e) {}
}

