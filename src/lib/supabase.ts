import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      diagnostic_sessions: {
        Row: {
          id: string
          created_at: string
          completed_at: string | null
          sector: string | null
          scale: string | null
          situation: string | null
          role: string | null
          focus_areas: string[]
          answers: Json
          scores: Json | null
          archetype_id: string | null
          flags_triggered: string[]
          output: Json | null
          opted_in: boolean
          contact_email: string | null
          contact_name: string | null
          contact_company: string | null
          brief_sent: boolean
          brief_sent_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          completed_at?: string | null
          sector?: string | null
          scale?: string | null
          situation?: string | null
          role?: string | null
          focus_areas?: string[]
          answers?: Json
          scores?: Json | null
          archetype_id?: string | null
          flags_triggered?: string[]
          output?: Json | null
          opted_in?: boolean
          contact_email?: string | null
          contact_name?: string | null
          contact_company?: string | null
          brief_sent?: boolean
          brief_sent_at?: string | null
        }
      }
    }
  }
}
