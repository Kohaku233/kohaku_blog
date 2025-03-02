// components/comments/CommentForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { SendHorizonal } from "lucide-react";

interface CommentFormProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  submitLabel?: string;
  isUserLoggedIn: boolean;
  onLoginClick: () => void;
  initialValue?: string;
}

export default function CommentForm({
  onSubmit,
  placeholder = "留下评论...",
  submitLabel = "提交",
  isUserLoggedIn,
  onLoginClick,
  initialValue = "",
}: CommentFormProps) {
  const [content, setContent] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    await onSubmit(content);
    setContent("");
    setIsSubmitting(false);
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-800">
      <CardContent className="pt-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="min-h-24 resize-none focus-visible:ring-primary"
          disabled={!isUserLoggedIn || isSubmitting}
        />
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 pt-0">
        {!isUserLoggedIn ? (
          <Button variant="outline" onClick={onLoginClick}>
            登录后评论
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            disabled={!content.trim() || isSubmitting}
            className="flex items-center gap-2"
          >
            {submitLabel}
            <SendHorizonal className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}