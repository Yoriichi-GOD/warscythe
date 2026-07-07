import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envConfig = fs.readFileSync('.env', 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      acc[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
    return acc;
  }, {});

const supabaseUrl = envConfig.VITE_SUPABASE_URL;
const supabaseAnonKey = envConfig.VITE_SUPABASE_ANON_KEY;

console.log('Connecting to:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const userId = '89d414ec-c28e-44fa-a4a7-556cd7975c2c';

console.log('Fetching current profile...');
const { data: selectData, error: selectErr } = await supabase.from('profiles').select('state').eq('id', userId);
if (selectErr) {
  console.error('Fetch failed:', selectErr);
} else {
  console.log('Fetch successful! Current state:', selectData?.[0] ? 'exists' : 'empty');
  
  console.log('Executing upsert request...');
  const start = Date.now();
  const { error: upsertErr } = await supabase.from('profiles').upsert({
    id: userId,
    state: selectData?.[0]?.state || {},
    updated_at: new Date().toISOString()
  });

  if (upsertErr) {
    console.error('Upsert failed:', upsertErr);
  } else {
    console.log('Upsert successful in', Date.now() - start, 'ms!');
  }
}
