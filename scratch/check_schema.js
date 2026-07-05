import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env file manually
const envPath = path.resolve('.env');
let supabaseUrl = '';
let supabaseAnonKey = '';

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts[0] === 'VITE_SUPABASE_URL') {
      supabaseUrl = parts[1].trim();
    }
    if (parts[0] === 'VITE_SUPABASE_ANON_KEY') {
      supabaseAnonKey = parts[1].trim();
    }
  });
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase
    .from('legion_subtasks')
    .select(`
      id,
      assignee:profiles!legion_subtasks_assigned_to_fkey(id, username)
    `)
    .limit(1);

  if (error) {
    console.error('Error with constraint name:', error.message);
    
    // Try column name syntax
    const { data: data2, error: error2 } = await supabase
      .from('legion_subtasks')
      .select(`
        id,
        assignee:profiles!assigned_to(id, username)
      `)
      .limit(1);
      
    if (error2) {
      console.error('Error with column name:', error2.message);
    } else {
      console.log('Success with column name syntax!');
    }
  } else {
    console.log('Success with constraint name syntax!');
  }
}

check();
