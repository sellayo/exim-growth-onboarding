import fs from 'fs';
import path from 'path';

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

async function testSql() {
  console.log('Testing SQL migration on Supabase...');
  try {
    const res = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`
      },
      body: JSON.stringify({ query: 'SELECT 1;' })
    });
    const text = await res.text();
    console.log('Response status:', res.status, text);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testSql();
