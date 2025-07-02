"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "./button";

interface CodeBlockProps {
  children: React.ReactNode;
  language?: string;
  title?: string;
  className?: string;
}

export function CodeBlock({ children, language, title, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (children && typeof children === "object" && "props" in children) {
      const code = children.props.children;
      if (typeof code === "string") {
        try {
          await navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error("Failed to copy code:", err);
        }
      }
    }
  };

  return (
    <div className="relative group my-6">
      {/* 代码块头部 */}
      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-t-lg border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          {/* 装饰性圆点 */}
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          
          {/* 文件名或语言 */}
          <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
            {title || language || "code"}
          </span>
        </div>

        {/* 复制按钮 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* 代码内容 */}
      <div className="relative">
        <pre
          className={`overflow-x-auto rounded-t-none rounded-b-lg bg-gray-50 dark:bg-gray-900 p-4 text-sm leading-relaxed ${className || ""}`}
        >
          {children}
        </pre>
      </div>
    </div>
  );
}

// 简单的内联代码组件
export function InlineCode({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <code className={`bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono ${className || ""}`}>
      {children}
    </code>
  );
}