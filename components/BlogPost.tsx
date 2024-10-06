"use client";
import { useState, useEffect } from "react";
import { blogApi, Blog } from "@/utils/api";
import ReactMarkdown from "react-markdown";

interface BlogPostProps {
  id: number;
}

export function BlogPost({ id }: BlogPostProps) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true);
      try {
        const fetchedBlog = await blogApi.getBlogById(id);
        setBlog(fetchedBlog);
      } catch (error) {
        console.error("获取博客时出错:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (isLoading) {
    return <div>加载中...</div>;
  }

  if (!blog) {
    return <div>博客未找到</div>;
  }

  return (
    <article className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
        {blog.title}
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
        最后修改时间: {new Date(blog.updated_at).toLocaleString()}
      </p>
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown>{blog.content}</ReactMarkdown>
      </div>
    </article>
  );
}
