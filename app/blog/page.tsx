import Link from "next/link";
import { getBlogPosts } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default async function BlogPage() {
  const blogs = await getBlogPosts();

  return (
    <div className="max-w-[688px] mx-auto ">
      <h1 className="text-4xl font-bold mb-6">Writing</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 text-balance">
        脑洞大开、探索性文章和操作指南。我写各种主题，如设计系统、
        可访问性、创业公司和用户/开发者体验。
      </p>
      <div className="space-y-8">
        {blogs.map((blog) => (
          <article
            key={blog.id}
            className="border-b border-gray-200 dark:border-gray-700 pb-8 last:border-b-0"
          >
            <Link href={`/blog/${blog.id}`} className="block group">
              <h2 className="text-2xl font-semibold mb-2 group-hover:text-blue-500 transition-colors">
                {blog.title}
              </h2>
              <p className=" text-lg text-gray-600 dark:text-gray-300 mb-2">
                {blog.content.substring(0, 150)}...
              </p>
              <time className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(blog.created_at)}
              </time>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
