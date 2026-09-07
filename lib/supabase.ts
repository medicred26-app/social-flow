import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kettuzklxorjkydoqcqr.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtldHR1emtseG9yamt5ZG9xY3FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyODQ2MjEsImV4cCI6MjA3Njg2MDYyMX0.cnZri4VB7njerX8lZ6H8tlWcItEC9fn1qcaCkTiZS58';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[SocialFlow Frontend] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
