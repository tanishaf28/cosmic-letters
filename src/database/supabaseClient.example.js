import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Copy this file to supabaseClient.js (same folder) and paste in your
// project's URL and anon (public) key after running schema.sql in the
// Supabase SQL editor. Project settings -> API.
//
// The anon key is meant to be public and safe to ship in client code;
// it has no power beyond what schema.sql's RLS policies allow.
// supabaseClient.js is gitignored so your values never hit GitHub;
// see scripts/generate-supabase-config.js for how Vercel builds get it.
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
