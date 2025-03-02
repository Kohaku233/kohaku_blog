"use server";

import { createSupabaseClient, type Database } from "./supabase";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

// 类型定义
export type Comment = Database["public"]["Tables"]["comments"]["Row"] & {
  profiles: {
    username: string | null;
    avatar_url: string | null;
    full_name: string | null;
  };
  replies?: Comment[];
  likes_count?: number;
  liked_by?: string[];
};

type CommentFormData = {
  post_slug: string;
  content: string;
  parent_id?: string | null;
};

// 获取环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// 创建服务器端Supabase客户端
export async function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.delete({ name, ...options });
      },
    },
  });
}

// 获取文章评论
export async function getComments(postSlug: string) {
  const supabase = createSupabaseClient();

  const { data: comments, error } = await supabase
    .from("comments")
    .select(
      `
      *,
      profiles:user_id (
        username,
        avatar_url,
        full_name
      )
    `
    )
    .eq("post_slug", postSlug)
    .is("parent_id", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching comments:", error);
    return [];
  }

  // 获取所有回复
  for (const comment of comments || []) {
    const { data: replies, error: repliesError } = await supabase
      .from("comments")
      .select(
        `
        *,
        profiles:user_id (
          username,
          avatar_url,
          full_name
        )
      `
      )
      .eq("parent_id", comment.id)
      .order("created_at", { ascending: true });

    if (!repliesError) {
      comment.replies = replies || [];
    }
  }

  return comments as Comment[];
}

// 添加评论
export async function addComment(formData: CommentFormData) {
  try {
    const supabase = await createServerSupabaseClient();

    // 获取当前登录用户
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "用户未登录" };
    }

    // 插入评论
    const { data, error } = await supabase
      .from("comments")
      .insert({
        user_id: user.id,
        post_slug: formData.post_slug,
        content: formData.content,
        parent_id: formData.parent_id || null,
      })
      .select(
        `
        *,
        profiles:user_id (
          username,
          avatar_url,
          full_name
        )
      `
      )
      .single();

    if (error) {
      return { error: error.message };
    }

    return { success: true, comment: data as Comment };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { error: "添加评论失败" };
  }
}

// 删除评论
export async function deleteComment(commentId: string) {
  try {
    const supabase = await createServerSupabaseClient();

    // 获取当前登录用户
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "用户未登录" };
    }

    // 验证评论是否属于当前用户
    const { data: comment } = await supabase
      .from("comments")
      .select("*")
      .eq("id", commentId)
      .eq("user_id", user.id)
      .single();

    if (!comment) {
      return { error: "没有权限删除此评论" };
    }

    // 删除评论
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return { error: "删除评论失败" };
  }
}
