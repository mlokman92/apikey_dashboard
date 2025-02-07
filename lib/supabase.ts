import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bsnisytaulhggmqvxkso.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzbmlzeXRhdWxoZ2dtcXZ4a3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1NzU3OTYsImV4cCI6MjA1NDE1MTc5Nn0.Qw1IsjYBGUd24XH1rfYmbMlMgVEE_ps2oyA48Ac0pZA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
}) 