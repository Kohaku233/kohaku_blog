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
          <p className="text-sm text-muted-foreground">
            以继续使用 kohaku.ink 评论系统
          </p>
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
