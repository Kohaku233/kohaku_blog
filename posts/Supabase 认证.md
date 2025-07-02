---
title: "集成 Supabase 认证"
date: "2025-03-02"
summary: "集成 Supabase 认证实现文章评论系统"
---

在构建现代 Web 应用时，用户认证是一个基础但复杂的功能。本文将详细介绍如何利用 Supabase 提供的认证服务，为博客评论系统实现完整的用户认证流程。

## 1. 认证架构概述

我们的评论系统采用了基于 JWT 的身份验证机制，通过 React Context API 提供全局用户状态管理，实现与 UI 组件的无缝集成。整个认证架构基于 Supabase Auth 构建，主要支持 GitHub OAuth 登录。

![认证流程图](https://i.imgur.com/CnG5bSy.png)

## 2. 核心组件实现

### 2.1 Supabase 客户端配置

首先，需要创建 Supabase 客户端并配置类型支持：

```typescript
// lib/supabase.ts
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
        // 其他类型定义...
      };
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          // 其他字段...
        };
        // 其他类型定义...
      };
    };
  };
};

// 创建Supabase客户端实例
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

### 2.2 认证上下文提供者

通过 Context API 创建全局认证状态管理：

```typescript
// components/auth/AuthProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithGithub: (redirectTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 获取初始会话状态
    const getInitialSession = async () => {
      try {
        setIsLoading(true);
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user || null);
      } catch (error) {
        console.error("Error getting initial session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // 设置认证状态监听器
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // GitHub登录
  const signInWithGithub = async (redirectTo?: string) => {
    const redirectUrl = redirectTo
      ? `${window.location.origin}${redirectTo}`
      : undefined;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      console.error("GitHub 登录错误:", error);
      throw error;
    }
  };

  // 登出
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("登出失败:", error);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signInWithGithub,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 自定义Hook，用于在组件中使用认证上下文
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth必须在AuthProvider内部使用");
  }

  return context;
}
```

### 2.3 登录对话框组件

创建用户友好的登录界面：

```typescript
// components/auth/LoginDialog.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "./AuthProvider";
import { usePathname } from "next/navigation";

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginDialog({ isOpen, onClose }: LoginDialogProps) {
  const { signInWithGithub } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  const handleGithubLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithGithub(pathname);
      onClose();
    } catch (error) {
      console.error("GitHub登录失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6 gap-6">
        <DialogClose className="absolute right-4 top-4">
          <X className="h-4 w-4" />
          <span className="sr-only">关闭</span>
        </DialogClose>

        <div>
          <DialogTitle className="text-xl font-bold mb-2">登入</DialogTitle>
          <p className="text-sm text-muted-foreground">以继续使用评论系统</p>
        </div>

        <div className="flex flex-col space-y-3">
          <Button
            className="w-full bg-black hover:bg-gray-800 text-white"
            onClick={handleGithubLogin}
            disabled={isLoading}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 mr-2"
              fill="currentColor"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            使用 GitHub 继续
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

## 3. 认证流程详解

### 3.1 初始化与会话管理

当应用加载时，AuthProvider 组件会：

1. 检查本地存储中的会话信息
2. 设置认证状态监听器，响应登录状态变化
3. 向所有子组件提供统一的认证上下文

认证状态变更（如登录或登出）时，会自动更新全局状态并反映到 UI 中。

### 3.2 用户登录流程

当用户点击登录按钮时：

1. 触发`handleGithubLogin`函数
2. 调用 Supabase 的 OAuth 接口，重定向到 GitHub 授权页面
3. 用户在 GitHub 上授权后，被重定向回应用
4. Supabase 处理返回的授权码，获取访问令牌
5. 创建会话并通过`onAuthStateChange`事件通知应用
6. AuthProvider 更新用户状态，UI 随之更新

### 3.3 会话持久化

Supabase 使用多种机制确保会话的持久性：

- **localStorage**：存储会话数据，实现跨页面导航的状态保持
- **自动令牌刷新**：JWT 接近过期时自动刷新
- **同步机制**：确保多个标签页中的认证状态一致

## 4. 与评论系统集成

### 4.1 评论提交与用户关联

```typescript
// CommentSection.tsx中的评论提交函数
const handleCommentSubmit = async (content: string, parentId?: string) => {
  // 检查用户登录状态
  if (!user) {
    setIsLoginDialogOpen(true);
    return;
  }

  try {
    // 显示提交中状态
    toast.loading("正在提交评论...", {
      position: "bottom-right",
      id: "comment-submit",
    });

    // 提交到数据库
    const { error } = await supabase.from("comments").insert({
      user_id: user.id, // 使用当前登录用户ID
      post_slug: postSlug,
      content,
      parent_id: parentId || null,
    });

    if (error) {
      throw error;
    }

    // 显示成功提示
    toast.success("评论发布成功！", {
      position: "bottom-right",
      id: "comment-submit",
    });

    // 刷新评论列表
    loadComments();
  } catch (error) {
    console.error("提交评论失败:", error);
    toast.error("评论发布失败，请稍后重试", {
      position: "bottom-right",
      id: "comment-submit",
    });
  }
};
```

### 4.2 评论显示与用户信息

在 CommentItem 组件中展示用户信息：

```typescript
const profile = comment.profiles;
const username = profile.username || profile.full_name || "匿名用户";

return (
  <Card className="border-gray-100 dark:border-gray-800 shadow-sm">
    <CardHeader className="flex flex-row items-start space-y-0 pt-4 pb-2">
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={profile.avatar_url || ""} alt={username} />
          <AvatarFallback>
            <UserIcon className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium text-sm">{username}</div>
          <div className="text-xs text-muted-foreground">
            {formatDistanceToNow(createdAt)}
          </div>
        </div>
      </div>

      {/* 只有评论作者可以看到删除选项 */}
      {isOwnComment && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-auto">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onDelete(comment.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </CardHeader>

    {/* 评论内容和操作按钮 */}
    {/* ... */}
  </Card>
);
```

## 5. 数据库配置与安全

### 5.1 数据模型

评论系统涉及两个主要的数据表：

**profiles 表**：存储用户资料

```sql
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone
);
```

**comments 表**：存储评论内容

```sql
create table comments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  post_slug text not null,
  content text not null,
  parent_id uuid references comments(id) on delete cascade,
  created_at timestamp with time zone default now(),
  likes_count integer default 0,
  liked_by uuid[] default '{}'::uuid[]
);
```

### 5.2 行级安全策略(RLS)

为确保数据安全，我们设置了精细的 RLS 策略：

```sql
-- profiles表策略
create policy "公开读取用户资料" on profiles
  for select using (true);

create policy "用户可更新自己的资料" on profiles
  for update using (auth.uid() = id);

-- comments表策略
create policy "公开读取评论" on comments
  for select using (true);

create policy "已登录用户可创建评论" on comments
  for insert with check (auth.uid() = user_id);

create policy "用户可更新自己的评论" on comments
  for update using (auth.uid() = user_id);

create policy "用户可删除自己的评论" on comments
  for delete using (auth.uid() = user_id);

-- 特殊策略：允许用户点赞任何评论
create policy "用户可更新评论点赞" on comments
  for update using (auth.uid() is not null)
  with check (
    -- 只允许更新likes_count和liked_by字段
    (auth.uid() = user_id) or
    (
      coalesce(current_setting('app.column_check', true), '') = 'liked_by,likes_count'
    )
  );
```

### 5.3 用户资料自动同步

通过数据库触发器自动同步用户信息：

```sql
-- 触发器函数：在用户注册时创建资料
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'user_name',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- 绑定触发器
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## 6. 评论系统的实时更新

### 6.1 实时订阅配置

```typescript
// 设置实时订阅评论变化
const commentsSubscription = supabase
  .channel("comments-changes")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "comments",
      filter: `post_slug=eq.${postSlug}`,
    },
    (payload) => {
      // 处理实时更新...
    }
  )
  .subscribe();
```

### 6.2 处理实时更新

```typescript
// 处理点赞更新
if (isOnlyLikeUpdate && updatedComment.id) {
  console.log("检测到点赞更新:", updatedComment);

  // 局部更新评论列表中的点赞信息
  setComments((prevComments) =>
    prevComments.map((comment) => {
      // 更新主评论
      if (comment.id === updatedComment.id) {
        return {
          ...comment,
          likes_count: updatedComment.likes_count,
          liked_by: updatedComment.liked_by,
        };
      }

      // 更新回复
      if (comment.replies) {
        return {
          ...comment,
          replies: comment.replies.map((reply) =>
            reply.id === updatedComment.id
              ? {
                  ...reply,
                  likes_count: updatedComment.likes_count,
                  liked_by: updatedComment.liked_by,
                }
              : reply
          ),
        };
      }

      return comment;
    })
  );
} else {
  // 对于其他更新，刷新整个列表
  loadComments();
}
```

## 7. 性能优化与最佳实践

### 7.1 减少不必要的渲染

使用 React 的 useCallback 和 useMemo 优化性能：

```typescript
// 使用useCallback缓存函数
const loadComments = useCallback(async () => {
  // 加载评论的逻辑...
}, [postSlug, sortOrder, commentsInitialized]);
```

### 7.2 错误处理与用户反馈

使用 toast 提供友好的用户反馈：

```typescript
try {
  // 操作代码...
  toast.success("操作成功");
} catch (error) {
  console.error("错误:", error);
  toast.error("操作失败，请稍后重试");
}
```

## 8. 流程总结

整个认证流程可以概括为以下步骤：

1. 用户点击登录按钮，打开登录对话框
2. 选择 GitHub 登录方式，重定向到 GitHub 授权页面
3. 授权成功后返回应用，Supabase 处理回调并创建会话
4. AuthProvider 更新全局用户状态
5. UI 根据用户状态显示评论功能、个人信息等
6. 用户可以发表评论、点赞、删除自己的评论
7. 所有操作都经过 RLS 策略验证，确保安全性
8. 实时订阅保证多用户同时在线时的数据一致性

## 9. 总结与拓展

Supabase 提供了强大而简洁的认证解决方案，让我们能够快速实现功能齐全的用户认证系统。这种架构的优势在于：

- **简化开发**：无需自建认证服务器
- **开箱即用**：社交登录功能完善
- **安全可靠**：JWT 认证与 RLS 策略结合
- **可扩展性**：易于添加更多认证提供商
- **实时功能**：内置的实时数据同步

未来可以考虑的拓展方向：

- 添加更多第三方登录选项（如 Google、Twitter 等）
- 实现邮箱密码登录
- 添加用户资料编辑功能
- 实现评论审核机制
- 添加通知系统，提醒用户收到回复或点赞

---

通过以上步骤，我们成功构建了一个完整的评论系统，集成了 Supabase 的认证功能。这不仅提升了用户体验，还确保了数据的安全与完整性。
