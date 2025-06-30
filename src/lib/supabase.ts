import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      problems: {
        Row: {
          id: string;
          title: string;
          difficulty: 'Easy' | 'Medium' | 'Hard';
          category: string;
          status: 'Not Started' | 'In Progress' | 'Completed' | 'Failed';
          notes: string;
          solution: string;
          language: string;
          time_complexity: string;
          space_complexity: string;
          tags: string[];
          url: string;
          attempts: number;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
          user_id: string;
          description: string;
        };
        Insert: {
          id?: string;
          title: string;
          difficulty: 'Easy' | 'Medium' | 'Hard';
          category: string;
          status: 'Not Started' | 'In Progress' | 'Completed' | 'Failed';
          notes?: string;
          solution?: string;
          language?: string;
          time_complexity?: string;
          space_complexity?: string;
          tags?: string[];
          url?: string;
          attempts?: number;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          description?: string;
        };
        Update: {
          id?: string;
          title?: string;
          difficulty?: 'Easy' | 'Medium' | 'Hard';
          category?: string;
          status?: 'Not Started' | 'In Progress' | 'Completed' | 'Failed';
          notes?: string;
          solution?: string;
          language?: string;
          time_complexity?: string;
          space_complexity?: string;
          tags?: string[];
          url?: string;
          attempts?: number;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          description?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'user' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string;
          role?: 'user' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'user' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_analyses: {
        Row: {
          id: string;
          problem_id: string;
          analysis: string;
          created_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          problem_id: string;
          analysis: string;
          created_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          problem_id?: string;
          analysis?: string;
          created_at?: string;
          user_id?: string;
        };
      };
    };
  };
} 