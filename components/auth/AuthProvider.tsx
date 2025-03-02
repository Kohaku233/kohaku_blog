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

        // 检查现有会话
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
