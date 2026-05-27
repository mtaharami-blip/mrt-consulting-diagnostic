import { createClient, SupabaseClient } from '@supabase/supabase-js'

// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// ---------------------------------------------------------------------------
// Database types
// Matches the shape that @supabase/supabase-js v2 expects for typed clients.
// All required auxiliary fields (Relationships, Views, Functions, etc.) are
// present so the generic inference resolves correctly rather than to `never`.
// ---------------------------------------------------------------------------

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type Database = {
  public: {
    Tables: {
      diagnostic_sessions: {
        Row: {
          id: string
          created_at: string
          completed_at: string | null
          // Context intake
          sector: string | null
          scale: string | null
          situation: string | null
          role: string | null
          // Assessment
          focus_areas: string[]
          answers: Json
          // Computed results
          scores: Json | null
          archetype_id: string | null
          flags_triggered: string[]
          output: Json | null
          // Lead capture
          opted_in: boolean
          contact_email: string | null
          contact_name: string | null
          contact_company: string | null
          contact_phone: string | null
          // Consultant workflow
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
          contact_phone?: string | null
          brief_sent?: boolean
          brief_sent_at?: string | null
        }
        Update: {
          opted_in?: boolean
          contact_email?: string | null
          contact_name?: string | null
          contact_company?: string | null
          contact_phone?: string | null
          brief_sent?: boolean
          brief_sent_at?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: Record<never, never>
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}

export type DiagnosticSessionRow =
  Database['public']['Tables']['diagnostic_sessions']['Row']
export type DiagnosticSessionInsert =
  Database['public']['Tables']['diagnostic_sessions']['Insert']
export type DiagnosticSessionUpdate =
  Database['public']['Tables']['diagnostic_sessions']['Update']

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

export type TypedSupabaseClient = SupabaseClient<Database>

export const supabase: TypedSupabaseClient | null = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl!, supabaseAnonKey!)
  : null

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns the typed client or throws if Supabase is not configured.
 * Use inside server-side code that requires a working DB connection.
 */
export function requireSupabase(): TypedSupabaseClient {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    )
  }
  return supabase
}
