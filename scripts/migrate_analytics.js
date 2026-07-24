import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env manually
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');

const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length > 0) {
    env[key.trim()] = vals.join('=').trim();
  }
});

const url = env.VITE_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false }
});

async function runMigration() {
  console.log('🚀 Connecting to Supabase with Service Role Key...');

  const { data: posts, error: fetchErr } = await supabaseAdmin
    .from('trade_posts_all')
    .select('id, views_count, clicks_count')
    .limit(1);

  if (fetchErr) {
    console.log('Notice when querying views_count/clicks_count:', fetchErr.message);
  } else {
    console.log('✅ trade_posts_all table is accessible and columns exist:', posts);
  }
}

runMigration();
