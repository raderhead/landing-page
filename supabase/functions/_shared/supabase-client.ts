
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.29.0';

// Create a single Supabase client for interacting with your database
export const supabase = createClient(
  // These env vars will be replaced automatically when deployed
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);
