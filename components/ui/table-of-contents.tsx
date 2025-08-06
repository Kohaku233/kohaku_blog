"use client";

import { useState, useEffect } from "react";
import { TocItem } from "@/lib/posts";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  toc: TocItem[];
  className?: string;
  onItemClick?: () => void;
}

export function TableOfContents({ toc, className, onItemClick }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const getHeadingPositions = () => {
      return toc.map(({ id }) => {
        const element = document.getElementById(id);
        return element ? { id, offsetTop: element.offsetTop } : null;
      }).filter((item): item is { id: string; offsetTop: number } => item !== null);
    };

    const updateActiveHeading = () => {
      const headings = getHeadingPositions();
      if (headings.length === 0) return;

      const scrollTop = window.scrollY;
      
      // 找到当前滚动位置应该激活的标题
      // 如果页面刚加载，激活第一个标题
      if (scrollTop < headings[0].offsetTop - 100) {
        setActiveId(headings[0].id);
        return;
      }

      // 找到最后一个已经滚过的标题
      let activeHeading = headings[0];
      
      for (const heading of headings) {
        if (heading.offsetTop <= scrollTop + 100) {
          activeHeading = heading;
        } else {
          break;
        }
      }

      setActiveId(activeHeading.id);
    };

    // 节流函数，避免过于频繁的更新
    let throttleTimer: NodeJS.Timeout | null = null;
    const throttledUpdate = () => {
      if (throttleTimer) return;
      
      throttleTimer = setTimeout(() => {
        updateActiveHeading();
        throttleTimer = null;
      }, 50);
    };

    // 初始设置
    setTimeout(updateActiveHeading, 100);

    // 监听滚动
    window.addEventListener('scroll', throttledUpdate, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledUpdate);
      if (throttleTimer) {
        clearTimeout(throttleTimer);
      }
    };
  }, [toc]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // 精确计算滚动位置
      const elementTop = element.offsetTop;
      const scrollToPosition = elementTop - 10; // 留 10px 间距
      
      // 使用 window.scrollTo 获得最精确的控制
      window.scrollTo({
        top: Math.max(0, scrollToPosition), // 确保不会滚动到负数位置
        behavior: "smooth"
      });
      
      // 延迟设置高亮，让滚动检测自然地处理切换
      // 这样可以避免原标题的闪烁
    }
    
    // 调用回调函数（用于关闭移动端抽屉）
    onItemClick?.();
  };

  if (!toc || toc.length === 0) {
    return null;
  }

  return (
    <nav className={cn("space-y-1", className)}>
      {/* 可爱的标题 */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
          <span className="text-white text-xs">📖</span>
        </div>
        <div className="text-sm font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          目录导航
        </div>
      </div>

      {/* 目录列表 */}
      <ul className="space-y-1 text-sm">
        {toc.map((item, index) => (
          <li key={item.id} className="relative">
            <button
              onClick={() => handleClick(item.id)}
              className={cn(
                "group relative w-full text-left rounded-lg py-2 px-3 overflow-hidden",
                "transition-all duration-500 ease-in-out",
                "hover:scale-[1.01] hover:shadow-md",
                {
                  // 激活状态 - 更柔和的变化
                  "text-blue-700 dark:text-blue-300 font-medium transform scale-[1.02]": activeId === item.id,
                  
                  // 非激活状态
                  "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200": activeId !== item.id,
                  
                  // 层级缩进
                  "ml-0": item.level === 1,
                  "ml-4": item.level === 2,
                  "ml-8": item.level === 3,
                  "ml-12": item.level === 4,
                  "ml-16": item.level === 5,
                  "ml-20": item.level === 6,
                }
              )}
            >
              {/* 可爱的层级指示器 */}
              <div className="flex items-center gap-2 relative z-10">
                {item.level === 1 && (
                  <span 
                    className={cn(
                      "text-xs transition-all duration-500",
                      activeId === item.id 
                        ? "text-pink-500 animate-bounce" 
                        : "text-pink-400"
                    )}
                  >
                    🌟
                  </span>
                )}
                {item.level === 2 && (
                  <span 
                    className={cn(
                      "text-xs transition-all duration-500",
                      activeId === item.id 
                        ? "text-blue-500 animate-pulse" 
                        : "text-blue-400"
                    )}
                  >
                    ✨
                  </span>
                )}
                {item.level === 3 && (
                  <span 
                    className={cn(
                      "text-xs transition-all duration-500",
                      activeId === item.id 
                        ? "text-purple-500 animate-spin" 
                        : "text-purple-400"
                    )}
                  >
                    💫
                  </span>
                )}
                {item.level >= 4 && (
                  <span 
                    className={cn(
                      "text-xs transition-all duration-500",
                      activeId === item.id 
                        ? "text-gray-600 dark:text-gray-300 scale-125" 
                        : "text-gray-400 scale-100"
                    )}
                  >
                    •
                  </span>
                )}
                
                <span 
                  className={cn(
                    "flex-1 leading-relaxed transition-all duration-500",
                    activeId === item.id && "translate-x-1"
                  )}
                >
                  {item.text}
                </span>
                
                {/* 激活状态的小装饰 - 更丝滑的出现动画 */}
                <span 
                  className={cn(
                    "text-xs transition-all duration-500 ease-out",
                    activeId === item.id 
                      ? "text-blue-500 opacity-100 scale-100 animate-pulse" 
                      : "opacity-0 scale-0"
                  )}
                >
                  👀
                </span>
              </div>

              {/* 动态背景效果 */}
              <div 
                className={cn(
                  "absolute inset-0 rounded-lg transition-all duration-700 ease-out",
                  "bg-gradient-to-r opacity-0",
                  {
                    // 激活状态的背景
                    "from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 opacity-100": activeId === item.id,
                    // 悬停状态的背景  
                    "group-hover:from-blue-25 group-hover:to-purple-25 dark:group-hover:from-blue-900/10 dark:group-hover:to-purple-900/10 group-hover:opacity-60": activeId !== item.id,
                  }
                )}
              />
              
              {/* 激活状态的边框光晕 */}
              {activeId === item.id && (
                <div className="absolute inset-0 rounded-lg border border-blue-200/60 dark:border-blue-400/30 animate-pulse" />
              )}
              
              {/* 激活状态的左侧装饰条 */}
              <div 
                className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all duration-500 ease-out",
                  {
                    "h-8 bg-gradient-to-b from-blue-500 to-purple-500 opacity-100": activeId === item.id,
                    "h-0 opacity-0": activeId !== item.id,
                  }
                )}
              />
            </button>

            {/* 连接线装饰 */}
            {item.level > 1 && index < toc.length - 1 && (
              <div 
                className="absolute left-2 top-full w-px h-2 bg-gradient-to-b from-gray-300 to-transparent dark:from-gray-600"
                style={{ marginLeft: `${(item.level - 2) * 16}px` }}
              />
            )}
          </li>
        ))}
      </ul>

      {/* 底部装饰 */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-400 dark:text-gray-500 text-center flex items-center justify-center gap-1">
          <span>✨</span>
          <span>快乐阅读</span>
          <span>✨</span>
        </div>
      </div>
    </nav>
  );
}