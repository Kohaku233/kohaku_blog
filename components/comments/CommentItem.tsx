"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "@/utils/date";
import { User } from "@supabase/supabase-js";
import { Comment } from "@/lib/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Reply,
  Trash2,
  ThumbsUp,
  User as UserIcon,
} from "lucide-react";
import CommentForm from "./CommentForm";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface CommentItemProps {
  comment: Comment;
  currentUser: User | null;
  onDelete: (commentId: string) => void;
  onReply: (content: string, parentId: string) => void;
  setIsLoginDialogOpen: (isOpen: boolean) => void;
}

export default function CommentItem({
  comment,
  currentUser,
  onDelete,
  onReply,
  setIsLoginDialogOpen,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(
    comment.likes_count || 0
  );

  const likedBy = comment.liked_by || [];

  // 检查当前用户是否已经点赞过该评论
  useEffect(() => {
    if (currentUser) {
      const hasLiked =
        Array.isArray(likedBy) && likedBy.includes(currentUser.id);
      setIsLiked(hasLiked);
    }
    setLocalLikesCount(comment.likes_count || 0);
  }, [likedBy, currentUser, comment.likes_count]);

  const handleReplySubmit = (content: string) => {
    onReply(content, comment.id);
    setIsReplying(false);
  };

  // 处理点赞 - 先更新数据库，成功后再更新UI
  const handleLike = async () => {
    if (!currentUser) {
      setIsLoginDialogOpen(true);
      return;
    }

    // 防止对临时ID的评论进行点赞
    if (comment.id.toString().startsWith("temp-")) {
      toast.warning("新评论正在提交中，请稍后再点赞", {
        position: "bottom-right",
        duration: 3000,
      });
      return;
    }

    setIsLikeLoading(true);

    try {
      // 确定新的点赞状态和数据
      const newIsLiked = !isLiked;
      const newLikesCount = newIsLiked
        ? localLikesCount + 1
        : Math.max(0, localLikesCount - 1);

      // 准备更新数据
      let updatedLikedBy;
      if (newIsLiked) {
        updatedLikedBy = [...likedBy, currentUser.id];
      } else {
        updatedLikedBy = likedBy.filter((id) => id !== currentUser.id);
      }

      // 调用API更新数据库
      const { error, data } = await supabase
        .from("comments")
        .update({
          likes_count: newLikesCount,
          liked_by: updatedLikedBy,
        })
        .eq("id", comment.id)
        .select("likes_count, liked_by");

      if (error) {
        console.error("点赞更新失败:", error);
        throw error;
      }

      // 更新成功后再更新UI状态
      if (data && data.length > 0) {
        // 使用服务器返回的数据更新UI
        setLocalLikesCount(data[0].likes_count || 0);

        if (currentUser) {
          const hasLiked =
            Array.isArray(data[0].liked_by) &&
            data[0].liked_by.includes(currentUser.id);
          setIsLiked(hasLiked);
        }

        // 显示成功消息
        if (newIsLiked) {
          toast.success("点赞成功！", {
            position: "bottom-right",
            duration: 2000,
          });
        } else {
          toast.success("已取消点赞", {
            position: "bottom-right",
            duration: 2000,
          });
        }
      }
    } catch (error) {
      console.error("点赞操作失败:", error);
      toast.error("点赞操作失败，请稍后重试", {
        position: "bottom-right",
      });
    } finally {
      setIsLikeLoading(false);
    }
  };

  const isOwnComment = currentUser?.id === comment.user_id;
  const profile = comment.profiles;
  const username = profile.username || profile.full_name || "匿名用户";
  const createdAt = new Date(comment.created_at);

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

      <CardContent className="py-2">
        <div
          className="text-sm prose-sm max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{
            __html: comment.content.replace(/\n/g, "<br/>"),
          }}
        />
      </CardContent>

      <CardFooter className="flex justify-start space-x-2 pt-1 pb-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs"
          onClick={handleLike}
          disabled={isLikeLoading}
        >
          <ThumbsUp
            className={`mr-1 h-3.5 w-3.5 ${
              isLiked ? "fill-current text-primary" : ""
            }`}
          />
          {isLikeLoading
            ? "处理中..."
            : `赞 ${localLikesCount > 0 ? localLikesCount : ""}`}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs"
          onClick={() =>
            currentUser
              ? setIsReplying(!isReplying)
              : setIsLoginDialogOpen(true)
          }
        >
          <Reply className="mr-1 h-3.5 w-3.5" />
          回复
        </Button>
      </CardFooter>

      {isReplying && (
        <div className="px-4 pb-4">
          <CommentForm
            onSubmit={handleReplySubmit}
            placeholder="回复评论..."
            submitLabel="回复"
            isUserLoggedIn={!!currentUser}
            onLoginClick={() => setIsLoginDialogOpen(true)}
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="px-4 pb-4">
          <Separator className="my-2" />
          <div className="pl-4 border-l-2 border-muted space-y-4 mt-2">
            {comment.replies.map((reply) => (
              <div key={reply.id} className="pt-2">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage
                      src={reply.profiles.avatar_url || ""}
                      alt={reply.profiles.username || "用户"}
                    />
                    <AvatarFallback>
                      <UserIcon className="h-3 w-3" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-medium text-xs">
                    {reply.profiles.username ||
                      reply.profiles.full_name ||
                      "匿名用户"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(reply.created_at))}
                  </div>

                  {currentUser?.id === reply.user_id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onDelete(reply.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-3 w-3" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                <div
                  className="text-xs mt-1 prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{
                    __html: reply.content.replace(/\n/g, "<br/>"),
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
