"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Comment } from "@/lib/actions";
import { supabase } from "@/lib/supabase";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import LoginDialog from "../auth/LoginDialog";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CommentSectionProps {
  postSlug: string;
}

export default function CommentSection({ postSlug }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [commentsInitialized, setCommentsInitialized] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [replyCount, setReplyCount] = useState(0);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  // 使用useCallback包装loadComments以避免不必要的重渲染
  const loadComments = useCallback(async () => {
    try {
      if (!commentsInitialized) {
        setIsCommentsLoading(true);
      }

      // 使用嵌套查询一次性获取评论和用户资料
      const { data: mainComments, error: mainError } = await supabase
        .from("comments")
        .select(
          `
          *,
          profiles(
            username,
            avatar_url,
            full_name
          )
        `
        )
        .eq("post_slug", postSlug)
        .is("parent_id", null)
        .order("created_at", { ascending: sortOrder === "oldest" });

      if (mainError) {
        throw mainError;
      }

      // 防止出现null值导致问题
      const safeMainComments = mainComments || [];

      // 获取所有回复及其用户资料
      const commentsWithReplies = await Promise.all(
        safeMainComments.map(async (comment) => {
          const { data: replies, error: repliesError } = await supabase
            .from("comments")
            .select(
              `
              *,
              profiles(
                username,
                avatar_url,
                full_name
              )
            `
            )
            .eq("parent_id", comment.id)
            .order("created_at", { ascending: true });

          if (repliesError) {
            console.error("获取回复失败:", repliesError);
            return { ...comment, replies: [] };
          }

          return { ...comment, replies: replies || [] };
        })
      );

      // 设置评论数据
      setComments(commentsWithReplies as Comment[]);
      setCommentsInitialized(true);

      // 计算评论和回复数量
      let totalReplies = 0;
      commentsWithReplies.forEach((comment) => {
        if (comment.replies) {
          totalReplies += comment.replies.length;
        }
      });

      setCommentCount(commentsWithReplies.length);
      setReplyCount(totalReplies);
    } catch (error) {
      console.error("加载评论失败:", error);
      toast.error("加载评论失败，请刷新页面重试", {
        position: "bottom-right",
      });
    } finally {
      setIsCommentsLoading(false);
    }
  }, [postSlug, sortOrder, commentsInitialized]);

  // 初始加载评论和设置实时订阅
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (isMounted) {
        await loadComments();
      }
    };

    fetchData();

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
          if (isMounted) {
            // 根据事件类型执行本地更新
            const eventType = payload.eventType;

            // 对于点赞更新，我们不刷新整个列表，而是局部更新状态
            if (eventType === "UPDATE") {
              const updatedComment = payload.new as Comment;

              // 检查是否只有点赞相关字段发生变化
              const oldComment = payload.old as Comment;
              const isOnlyLikeUpdate =
                updatedComment.content === oldComment.content &&
                updatedComment.user_id === oldComment.user_id &&
                updatedComment.parent_id === oldComment.parent_id;

              if (isOnlyLikeUpdate && updatedComment.id) {
                console.log("检测到点赞更新:", updatedComment);

                // 局部更新评论列表中的点赞信息
                setComments((prevComments) =>
                  prevComments.map((comment) => {
                    // 如果是主评论
                    if (comment.id === updatedComment.id) {
                      return {
                        ...comment,
                        likes_count: updatedComment.likes_count,
                        liked_by: updatedComment.liked_by,
                      };
                    }

                    // 如果是回复中的评论
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
                // 对于其他类型的更新，执行完整刷新
                loadComments();
              }
            } else {
              // 对于INSERT和DELETE事件，执行完整刷新
              loadComments();
            }
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(commentsSubscription);
    };
  }, [postSlug, sortOrder, loadComments]);

  // 处理评论提交 - 等待服务器响应后再更新UI
  const handleCommentSubmit = async (content: string, parentId?: string) => {
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

      // 提交到数据库并获取新评论数据
      const { error } = await supabase.from("comments").insert({
        user_id: user.id,
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

      // 如果没有设置实时订阅或者需要立即更新UI，可以手动更新
      // 但在这个应用中，我们依赖实时订阅来更新评论列表，不需要手动更新
      loadComments(); // 可选：立即刷新评论列表
    } catch (error) {
      console.error("提交评论失败:", error);
      toast.error("评论发布失败，请稍后重试", {
        position: "bottom-right",
        id: "comment-submit",
      });
    }
  };

  // 打开删除确认对话框
  const openDeleteDialog = (commentId: string) => {
    if (!commentId) return;

    // 先设置要删除的评论ID，然后再打开对话框
    setCommentToDelete(commentId);

    // 确保在下一个渲染周期再打开对话框
    setTimeout(() => {
      setDeleteDialogOpen(true);
    }, 0);
  };

  // 处理评论删除 - 等待服务器响应后再更新UI
  const handleCommentDelete = async () => {
    if (!user || !commentToDelete) return;

    try {
      // 先关闭对话框，避免UI阻塞
      setDeleteDialogOpen(false);

      // 显示删除中状态
      toast.loading("正在删除评论...", {
        position: "bottom-right",
        id: "comment-delete",
      });

      // 提交到数据库
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentToDelete);

      if (error) {
        throw error;
      }

      // 显示成功提示
      toast.success("评论已删除", {
        position: "bottom-right",
        id: "comment-delete",
      });

      // 清除要删除的评论ID
      setCommentToDelete(null);

      // 依赖实时订阅更新UI
      loadComments(); // 可选：立即刷新评论列表
    } catch (error) {
      console.error("删除评论失败:", error);
      toast.error("删除评论失败，请稍后重试", {
        position: "bottom-right",
        id: "comment-delete",
      });

      // 确保清理状态
      setCommentToDelete(null);
    }
  };

  return (
    <div className="mt-12 w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h2 className="text-xl font-semibold">
            {commentCount} 评论 · {replyCount} 回复
          </h2>
        </div>

        <Select
          value={sortOrder}
          onValueChange={(value) => setSortOrder(value as "newest" | "oldest")}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="排序方式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">最新</SelectItem>
            <SelectItem value="oldest">最早</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 评论表单 */}
      <div className="mb-8">
        <CommentForm
          onSubmit={(content) => handleCommentSubmit(content)}
          placeholder="留下评论..."
          submitLabel="发表评论"
          isUserLoggedIn={!!user}
          onLoginClick={() => setIsLoginDialogOpen(true)}
        />
      </div>

      {/* 评论列表 */}
      <div className="space-y-6">
        {isCommentsLoading ? (
          Array(3)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))
        ) : comments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
              <h3 className="text-lg font-medium mb-1">暂无评论</h3>
              <p className="text-sm text-muted-foreground mb-4">
                成为第一个评论的人吧！
              </p>
              <Button
                onClick={() =>
                  user
                    ? document.querySelector("textarea")?.focus()
                    : setIsLoginDialogOpen(true)
                }
              >
                撰写评论
              </Button>
            </CardContent>
          </Card>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={user}
              onDelete={openDeleteDialog}
              onReply={handleCommentSubmit}
              setIsLoginDialogOpen={setIsLoginDialogOpen}
            />
          ))
        )}
      </div>

      {/* 登录对话框 */}
      <LoginDialog
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
      />

      {/* 删除确认对话框 */}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) {
            // 当对话框关闭时，清除要删除的评论ID，防止状态残留
            setCommentToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>删除评论</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除此评论吗？此动作无法复原。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleCommentDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
