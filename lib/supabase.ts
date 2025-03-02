import { createClient } from "@supabase/supabase-js";

// 定义数据库类型
export type Database = {
  public: {
    Tables: {
      comments: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          post_slug: string;
          content: string;
          parent_id: string | null;
          likes_count: number;
          liked_by: string[];
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          post_slug: string;
          content: string;
          parent_id?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          post_slug?: string;
          content?: string;
          parent_id?: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          website: string | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
        };
      };
    };
  };
};

// 创建Supabase客户端实例，包含类型支持
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// 创建服务器端和客户端共用的supabase实例
export const createSupabaseClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
};
