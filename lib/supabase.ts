import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lwzonomdxycxyqkycoxu.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3em9ub21keHljeHlxa3ljb3h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5NjY4NzMsImV4cCI6MjEwMzU0Mjg3M30.qXu5JX1IHEo4o_PcUjFYKMlv2VxJ-xuicOV4fAe7q_w';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[SocialFlow Frontend] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
