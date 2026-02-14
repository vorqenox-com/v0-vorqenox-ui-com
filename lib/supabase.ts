import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yfhugsosanigefqozqeu.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmaHVnc29zYW5pZ2VmcW96cWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MDI0NDMsImV4cCI6MjA2NTE3ODQ0M30.dQxGx3LqdZ-7R5fwgVw5cQ_a7WTA_fi'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
