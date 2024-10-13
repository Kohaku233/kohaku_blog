import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { getSortedPostsData, PostData } from '@/lib/posts';

import ReactMarkdown from "react-markdown";

export default async function BlogPage() {
  const allPostsData: PostData[] = getSortedPostsData();

  return (
    <div className="max-w-[688px] mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-6">Writing</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 text-balance">
        脑洞大开、探索性文章和操作指南。我写各种主题，如设计系统、
        可访问性、创业公司和用户/开发者体验。
      </p>
      <div className="space-y-8">
        {allPostsData.map((blog) => (
          <article
            key={blog.id}
            className="border-gray-200 dark:border-gray-700 pb-8 last:border-b-0"
          >
            <Link href={`/blog/${blog.id}`} className="block group">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                <h2 className="text-2xl font-semibold group-hover:text-[#C3000F] transition-colors mb-1 sm:mb-0">
                  {blog.title}
                </h2>
                <time className="text-lg text-gray-500 dark:text-gray-400">
                  {formatDate(blog.date)}
                </time>
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-300">
                <ReactMarkdown>
                  {blog.summary}
                </ReactMarkdown>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
