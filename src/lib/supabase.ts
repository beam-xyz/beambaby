
import { createClient } from '@supabase/supabase-js';

// For development, use hardcoded values 
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zgwveewvvcbiycokouhj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpnd3ZlZXd2dmNiaXljb2tvdWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNjA2NTksImV4cCI6MjA1NjgzNjY1OX0.aMjZ5x0gBkQfEgCMSalIqCpdT9SVjwkb1OP_kh2VyeU';

// In production, you should always use environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
