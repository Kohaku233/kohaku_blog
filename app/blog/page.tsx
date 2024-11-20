import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { getSortedPostsData, PostData } from '@/lib/posts';
import ReactMarkdown from "react-markdown";
import BlurFade from "@/components/ui/blur-fade";

export default async function BlogPage() {
  const allPostsData: PostData[] = getSortedPostsData();

  return (
    <div className="max-w-[688px] mx-auto px-4 sm:px-6 lg:px-8">
      <BlurFade>
        <h1 className="text-4xl font-bold mb-6">Writing</h1>
      </BlurFade>
      
      <BlurFade delay={0.2}>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 text-balance">
          记录自己平时的心得体会，包括但不限于：日常随笔、书籍分享、技能巩固等等，年度计划总结每年最后一天会准时更新！
        </p>
      </BlurFade>

      <div className="space-y-8">
        {allPostsData.map((blog, index) => (
          <BlurFade key={blog.id} delay={0.3 + index * 0.1}>
            <article className="border-gray-200 dark:border-gray-700 pb-8 last:border-b-0">
              <Link href={`/blog/${blog.id}`} className="block group">
                <div className="flex items-center justify-between gap-8">
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold group-hover:text-[#C3000F] transition-colors mb-2">
                      {blog.title}
                    </h2>
                    <div className="text-lg text-gray-600 dark:text-gray-300">
                      <ReactMarkdown>
                        {blog.summary}
                      </ReactMarkdown>
                    </div>
                  </div>
                  <time className="text-lg text-gray-500 dark:text-gray-400 shrink-0 self-center">
                    {formatDate(blog.date)}
                  </time>
                </div>
              </Link>
            </article>
          </BlurFade>
        ))}
      </div>
    </div>
  );
}
