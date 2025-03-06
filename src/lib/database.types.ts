
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      babies: {
        Row: {
          id: string
          created_at: string
          user_id: string
          name: string
          birth_date: string
          image_url?: string
          color: 'blue' | 'pink' | 'mint' | 'lavender' | 'peach'
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          name: string
          birth_date: string
          image_url?: string
          color: 'blue' | 'pink' | 'mint' | 'lavender' | 'peach'
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          name?: string
          birth_date?: string
          image_url?: string
          color?: 'blue' | 'pink' | 'mint' | 'lavender' | 'peach'
        }
      }
      naps: {
        Row: {
          id: string
          created_at: string
          baby_id: string
          start_time: string
          end_time?: string
          date: string
        }
        Insert: {
          id?: string
          created_at?: string
          baby_id: string
          start_time: string
          end_time?: string
          date: string
        }
        Update: {
          id?: string
          created_at?: string
          baby_id?: string
          start_time?: string
          end_time?: string
          date?: string
        }
      }
      feeds: {
        Row: {
          id: string
          created_at: string
          baby_id: string
          amount: number
          time: string
          date: string
        }
        Insert: {
          id?: string
          created_at?: string
          baby_id: string
          amount: number
          time: string
          date: string
        }
        Update: {
          id?: string
          created_at?: string
          baby_id?: string
          amount?: number
          time?: string
          date?: string
        }
      }
      daily_ratings: {
        Row: {
          id: string
          created_at: string
          baby_id: string
          rating: number
          date: string
        }
        Insert: {
          id?: string
          created_at?: string
          baby_id: string
          rating: number
          date: string
        }
        Update: {
          id?: string
          created_at?: string
          baby_id?: string
          rating?: number
          date?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
