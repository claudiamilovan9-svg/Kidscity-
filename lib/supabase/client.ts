import { createBrowserClient } from "@supabase/ssr";

const projectUrl = "https://nwjbqulxdzjsswrbkbsh.supabase.co";
const publishableKey = "sb_publishable_evfql3aND0_BiIfzP5R6Nw_hOa0jy_r";

export function createClient() {
  // Both values are public client configuration, never a service-role key.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || projectUrl;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || publishableKey;
  return createBrowserClient(url, key);
}
