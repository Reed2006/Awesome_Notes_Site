import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const CONFIG_ERROR =
  'Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.';

let cachedClient: SupabaseClient | null = null;
let cachedConfig: { url: string; anonKey: string } | null = null;

function readSupabaseConfig() {
  if (cachedConfig) {
    return cachedConfig;
  }

  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(CONFIG_ERROR);
  }

  cachedConfig = { url, anonKey };
  return cachedConfig;
}

export function getSupabaseClient(): SupabaseClient {
  if (!cachedClient) {
    const { url, anonKey } = readSupabaseConfig();
    cachedClient = createClient(url, anonKey);
  }
  return cachedClient;
}

export function getSupabaseConfig() {
  return readSupabaseConfig();
}
