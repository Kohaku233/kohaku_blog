"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { TocItem } from "@/lib/posts";
import { TableOfContents } from "./table-of-contents";
import { cn } from "@/lib/utils";

interface MobileTocProps {
  toc: TocItem[];
}

export function MobileToc({ toc }: MobileTocProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!toc || toc.length === 0) {
    return null;
  }

  return (
    <>
      {/* 浮动按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
        aria-label="打开目录"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* 遮罩层 */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <div
        className={cn(
          "lg:hidden fixed top-0 right-0 h-full w-80 max-w-[80vw] bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-200 dark:border-gray-800",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            目录
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            aria-label="关闭目录"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto h-full pb-20">
          <TableOfContents 
            toc={toc} 
            className="space-y-3"
          />
        </div>
      </div>
    </>
  );
}