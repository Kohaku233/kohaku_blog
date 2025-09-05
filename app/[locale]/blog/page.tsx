import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { getSortedPostsData, PostData } from "@/lib/posts";
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

      <div className="space-y-10">
        {allPostsData.map((blog, index) => (
          <BlurFade key={blog.id} delay={0.3 + index * 0.1}>
            <article className="group cursor-pointer relative">
              <Link href={`/blog/${blog.id}`} className="block">
                {/* 悬停背景效果 */}
                <div className="absolute inset-0 -mx-4 sm:-mx-6 lg:-mx-8 rounded-xl border border-transparent group-hover:border-gray-200 dark:group-hover:border-gray-700 group-hover:bg-gray-50/50 dark:group-hover:bg-gray-800/50 transition-all duration-300"></div>
                
                {/* 内容区域 */}
                <div className="relative flex flex-col gap-3 py-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold group-hover:text-[#C3000F] transition-colors leading-tight flex-1">
                      {blog.title}
                    </h2>
                    <time className="text-sm text-gray-400 dark:text-gray-500 font-mono ml-4 shrink-0">
                      {formatDate(blog.date)}
                    </time>
                  </div>
                  <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed mt-2">
                    {blog.summary}
                  </p>
                </div>
              </Link>
            </article>
          </BlurFade>
        ))}
      </div>
    </div>
  );
}
