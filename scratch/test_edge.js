import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env manually
let supabaseUrl = 'https://yrxchjontmgkjaazrybh.supabase.co';
let supabaseAnonKey = '';

try {
  const envContent = fs.readFileSync('.env', 'utf8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    if (line.startsWith('VITE_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim();
    }
    if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) {
      supabaseAnonKey = line.split('=')[1].trim();
    }
  }
} catch (e) {
  console.error("Could not read .env file, using default values");
}

if (!supabaseAnonKey) {
  console.error("Missing VITE_SUPABASE_ANON_KEY in environment.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runTest() {
  console.log("Creating temporary test user...");
  const email = `test-${Date.now()}@warscythe-test.com`;
  const password = "SuperSecretPassword123!";
  
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password
  });

  if (signUpError) {
    console.error("Failed to sign up test user:", signUpError.message);
    return;
  }

  const user = signUpData.user;
  const session = signUpData.session;
  console.log("User created successfully. ID:", user.id);
  
  let jwt = session?.access_token;
  if (!jwt) {
    console.log("Session not immediate. Signing in directly...");
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (signInError) {
      console.error("Sign in failed:", signInError.message);
      return;
    }
    jwt = signInData.session?.access_token;
  }

  if (!jwt) {
    console.error("Failed to retrieve user JWT token.");
    return;
  }

  console.log("Invoking create-order Edge Function...");
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify({
        item_id: 'shiva',
        item_type: 'theme'
      })
    });

    console.log("HTTP Status:", response.status, response.statusText);
    const bodyText = await response.text();
    console.log("Raw Response Body:", bodyText);
    
  } catch (err) {
    console.error("Fetch call failed:", err);
  }
}

runTest();
