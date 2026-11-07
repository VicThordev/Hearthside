import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Links in auth emails return here with their result in the URL hash. It is read before
// createClient runs because the client strips the hash and may announce the result before
// React has subscribed to it.
const redirectParams = new URLSearchParams(window.location.hash.slice(1));
export const authRedirect = {
  isRecovery: redirectParams.get('type') === 'recovery',
  hasSession: redirectParams.has('access_token'),
  error: redirectParams.get('error_description'),
};

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
}) : null;

export function requireSupabase(): SupabaseClient {
  if (!supabase) throw new Error('Supabase browser configuration is missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  return supabase;
}
