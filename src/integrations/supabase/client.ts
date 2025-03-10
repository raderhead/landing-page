
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
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
        'cache-control': 'no-cache'
      }
    }
  }
);
