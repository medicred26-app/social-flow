export interface Category {
  id?: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export interface FreelancerProfile {
  id: string;
  user_id: string;
  user_email: string;
  user_name?: string;
  user_avatar?: string;
  professional_title: string;
  bio: string;
  skills: string[];
  categories: string[];
  experience_years: number;
  availability_status: 'available' | 'busy' | 'unavailable';
  verification_status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'suspended';
  hourly_rate: number;
  portfolio_links?: { title: string; url: string }[];
  rating_avg: number;
  completed_jobs_count: number;
  rejection_reason?: string;
  created_at?: string;
}

export interface Service {
  id: string;
  freelancer_id: string;
  category_slug: string;
  title: string;
  description: string;
  price: number;
  delivery_days: number;
  revisions: number;
  is_active: boolean;
}

export interface Job {
  id: string;
  client_id: string;
  client_name?: string;
  client_email?: string;
  freelancer_id: string;
  service_id?: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  commission_percentage: number;
  platform_fee: number;
  freelancer_amount: number;
  deadline_days: number;
  status: 'requested' | 'pending' | 'accepted' | 'in_progress' | 'submitted' | 'revision_requested' | 'completed' | 'cancelled' | 'disputed';
  requirements?: string;
  deliverable_notes?: string;
  created_at?: string;
}

export interface Review {
  id: string;
  job_id: string;
  client_id: string;
  client_name: string;
  freelancer_id: string;
  rating: number;
  comment: string;
  created_at?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export async function fetchMarketplaceCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/marketplace/categories`);
    const data = await res.json();
    return data.categories || [];
  } catch (e) {
    console.error('Failed to fetch categories:', e);
    return [];
  }
}

export async function fetchApprovedFreelancers(filters: {
  category?: string;
  search?: string;
  availability?: string;
  minRating?: number;
} = {}): Promise<FreelancerProfile[]> {
  try {
    const query = new URLSearchParams();
    if (filters.category) query.append('category', filters.category);
    if (filters.search) query.append('search', filters.search);
    if (filters.availability) query.append('availability', filters.availability);
    if (filters.minRating) query.append('minRating', filters.minRating.toString());

    const res = await fetch(`${BACKEND_URL}/api/marketplace/freelancers?${query.toString()}`);
    const data = await res.json();
    return data.freelancers || [];
  } catch (e) {
    console.error('Failed to fetch freelancers:', e);
    return [];
  }
}

export async function fetchFreelancerProfile(id: string): Promise<FreelancerProfile | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/marketplace/freelancers/${id}`);
    const data = await res.json();
    return data.freelancer || null;
  } catch (e) {
    console.error('Failed to fetch freelancer profile:', e);
    return null;
  }
}

export async function fetchMyFreelancerProfile(userId: string): Promise<FreelancerProfile | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/marketplace/freelancer/me?userId=${encodeURIComponent(userId)}`);
    const data = await res.json();
    return data.profile || null;
  } catch (e) {
    console.error('Failed to fetch my freelancer profile:', e);
    return null;
  }
}

export async function applyAsFreelancer(payload: {
  userId: string;
  userEmail: string;
  userName?: string;
  userAvatar?: string;
  professionalTitle: string;
  bio: string;
  skills: string[];
  categories: string[];
  experienceYears: number;
  hourlyRate: number;
}): Promise<{ success: boolean; message?: string; profile?: FreelancerProfile; error?: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/marketplace/freelancers/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (e: any) {
    return { success: false, error: e.message || 'Failed to submit application' };
  }
}

export async function fetchPendingFreelancers(): Promise<FreelancerProfile[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/marketplace/admin/pending-freelancers`);
    const data = await res.json();
    return data.pending || [];
  } catch (e) {
    console.error('Failed to fetch pending freelancers:', e);
    return [];
  }
}

export async function verifyFreelancer(id: string, status: 'approved' | 'rejected' | 'suspended', reason = '') {
  try {
    const res = await fetch(`${BACKEND_URL}/api/marketplace/admin/verify-freelancer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, reason })
    });
    return await res.json();
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function fetchPlatformSettings() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/marketplace/admin/settings`);
    const data = await res.json();
    return data.settings || { commissionPercentage: 15 };
  } catch (e) {
    return { commissionPercentage: 15 };
  }
}

export async function updateCommissionPercentage(percentage: number) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/marketplace/admin/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commissionPercentage: percentage })
    });
    return await res.json();
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
