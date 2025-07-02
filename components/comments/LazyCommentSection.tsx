"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

// 动态导入评论组件
const CommentSection = dynamic(() => import("./CommentSection"), {
  ssr: false,
  loading: () => <CommentSkeleton />,
});

// 评论骨架屏组件
function CommentSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* 评论标题和排序 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      
      {/* 评论表单 */}
      <div className="space-y-4">
        <div className="h-24 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      
      {/* 评论列表 */}
      {Array(3).fill(0).map((_, i) => (
        <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="space-y-1">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
          <div className="space-y-2 mb-3">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface LazyCommentSectionProps {
  postSlug: string;
}

export default function LazyCommentSection({ postSlug }: LazyCommentSectionProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: "200px", // 提前200px开始加载
        threshold: 0.1,
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={observerRef}>
      {shouldLoad ? (
        <CommentSection postSlug={postSlug} />
      ) : (
        <CommentSkeleton />
      )}
    </div>
  );
}