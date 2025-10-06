import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lodlklelpouspciahmxf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvZGxrbGVscG91c3BjaWFobXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjI3MTQsImV4cCI6MjA3NTMzODcxNH0.4utNOK4GFuOdm-LsJ-IfA15xXG7sQh-lqGu_unIsyFc'

export const supabase = createClient(supabaseUrl, supabaseKey)
