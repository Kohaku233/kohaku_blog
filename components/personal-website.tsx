"use client";

import { useState, useEffect } from "react";
import { PenTool } from "lucide-react";
import { blogApi, Blog } from "@/utils/api";
import { Layout } from "./Layout";

export function PersonalWebsite() {
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const blogs = await blogApi.getAllBlogs();
        setLatestBlogs(blogs.slice(0, 2)); // 只获取最新的两篇博客
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchLatestBlogs();
  }, []);

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="sm:w-2/3">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-gray-900 dark:text-white">
            I am Kohaku
          </h1>
          <p className="text-xl sm:text-2xl mb-4 text-gray-800 dark:text-gray-200">
            an amateur programming enthusiast and a practitioner of long-termism.
          </p>
        </div>
        <div className="sm:w-1/3 mt-8 sm:mt-0 hidden sm:block">
          <div className="w-48 h-48 bg-black rounded-full mx-auto flex items-center justify-center">
            <span className="text-white text-6xl font-bold" style={{ fontFamily: 'Arial, sans-serif', fontStyle: 'italic' }}>K</span>
          </div>
        </div>
      </div>
      <section className="mt-24">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Latest Articles</h2>
        <div className="grid sm:grid-cols-2 gap-8">
          {latestBlogs.map((blog) => (
            <div key={blog.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <PenTool className="h-4 w-4 mr-1" />
                  <span>Blog</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{blog.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{blog.content.substring(0, 100)}...</p>
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                  <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Add more sections as needed */}
    </Layout>
  );
}