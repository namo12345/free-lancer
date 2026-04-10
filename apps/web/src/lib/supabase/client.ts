import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Browser-side Supabase client.
 * Used ONLY for Realtime channels (broadcast messages, notifications).
 * Auth is handled statically via cookie — we do NOT use Supabase auth here.
 */
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    }
  );
}
