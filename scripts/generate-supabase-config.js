// Regenerates src/database/supabaseClient.js from environment variables.
// Runs as Vercel's build command, since that file is gitignored and
// never committed. Not needed for local dev: just copy
// src/database/supabaseClient.example.js to supabaseClient.js and fill
// in your values by hand.

const fs = require('fs');
const path = require('path');

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables.');
  console.error('Set them in your Vercel project: Settings -> Environment Variables.');
  process.exit(1);
}

const out = `import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Generated at build time from Vercel Environment Variables by
// scripts/generate-supabase-config.js. Do not edit directly; changes
// will be overwritten on the next build.
const SUPABASE_URL = ${JSON.stringify(url)};
const SUPABASE_ANON_KEY = ${JSON.stringify(anonKey)};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
`;

const outPath = path.join(__dirname, '..', 'src', 'database', 'supabaseClient.js');
fs.writeFileSync(outPath, out);
console.log(`Wrote ${outPath}`);
