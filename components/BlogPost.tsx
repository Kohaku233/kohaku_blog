"use client";
import ReactMarkdown from "react-markdown";
import { Blog } from "@/utils/api";

interface BlogPostProps {
  blog: Blog;
}

export function BlogPost({ blog }: BlogPostProps) {
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
