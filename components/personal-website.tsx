"use client";

import { useState, useEffect } from "react";
import { PenTool, Eye } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { blogApi, Blog } from "@/utils/api";
import { Layout } from "./Layout";
import Link from 'next/link';

export function PersonalWebsite() {
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const blogs = await blogApi.getAllBlogs();
        setLatestBlogs(blogs.slice(0, 2));
      } catch (error) {
        console.error("获取博客时出错:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestBlogs();
  }, []);

  if (isLoading) {
    return <Layout><div>加载中...</div></Layout>;
  }

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row items-start justify-between">
        <div className="sm:w-1/2 pr-8">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-gray-900 dark:text-white">
            I am Kohaku
          </h1>
          <p className="text-xl sm:text-2xl mb-4 text-gray-800 dark:text-gray-200">
            an amateur programming enthusiast and a practitioner of long-termism.
          </p>
        </div>
        <div className="sm:w-1/2 mt-8 sm:mt-0 flex justify-end">
          <div className="w-48 h-48 bg-black rounded-full flex items-center justify-center">
            <span className="text-white text-6xl font-bold" style={{ fontFamily: 'Arial, sans-serif', fontStyle: 'italic' }}>K</span>
          </div>
        </div>
      </div>
      <section className="mt-24">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">最新文章</h2>
        <div className="grid sm:grid-cols-2 gap-8">
          {latestBlogs.map((blog) => (
            <Link href={`/blog/${blog.id}`} key={blog.id} passHref>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                    <PenTool className="h-4 w-4 mr-1" />
                    <span>博客</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{blog.views || 0} 次浏览</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{blog.title}</h3>
                  <div className="text-gray-600 dark:text-gray-400 mb-4 prose dark:prose-invert">
                    <ReactMarkdown>{blog.content.substring(0, 150) + (blog.content.length > 150 ? '...' : '')}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      {/* Add more sections as needed */}
    </Layout>
  );
}