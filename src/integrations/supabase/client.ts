
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xfmguaamogzirnnqktwz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmbWd1YWFtb2d6aXJubnFrdHd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NjMxMzMsImV4cCI6MjA1NzEzOTEzM30.OjoZDtrxo7z2Xa2fQ4_FSKISQehuSNx3UbHKjfFzNxg";

// Create a custom Supabase client with enhanced configuration
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'supabase.auth.token', // Consistent storage key
      flowType: 'pkce' // More secure authentication flow
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
        'cache-control': 'no-cache'
      }
    }
  }
);

// Helper function to get blogs with filtering applied
export const getFilteredBlogs = async () => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Always filter out problematic posts
  return data ? data.filter(blog => 
    !blog.title.includes("Abilene") && 
    !blog.excerpt.includes("Trump") && 
    !blog.excerpt.includes("Abilene Market")
  ) : [];
};

// Helper function to get the current user session
export const getCurrentSession = async () => {
  // Force refresh the session to ensure we have the latest state
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error fetching session:", error);
    throw error;
  }
  
  return data.session;
};

// Helper function to get the current user ID
export const getCurrentUserId = async () => {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error("No active session. Please sign in.");
  }
  return session.user.id;
};
