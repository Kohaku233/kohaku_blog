import { getPostData, getAllPostIds } from "@/lib/posts";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';

export async function generateStaticParams() {
  const allPosts = getAllPostIds();
  return allPosts.map((post) => ({
    slug: post.params.slug,
  }));
}

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const postData = await getPostData(params.slug);

  return (
    <div className="max-w-[688px] mx-auto px-4 sm:px-6 lg:px-8">
      <article className="prose dark:prose-invert prose-lg max-w-none
        prose-headings:font-bold prose-headings:text-[#553F7D] dark:prose-headings:text-[#A1FF6F]
        prose-h1:text-4xl
        prose-h2:text-3xl
        prose-h3:text-2xl
        prose-h4:text-xl
        prose-p:text-[#2B1B42] dark:prose-p:text-[#00FF00]/80
        prose-strong:text-[#FF6B00] dark:prose-strong:text-[#FF6B00]
        prose-ul:list-disc prose-ul:text-[#553F7D] dark:prose-ul:text-[#A1FF6F]
        prose-ol:list-decimal prose-ol:text-[#553F7D] dark:prose-ol:text-[#A1FF6F]
        prose-li:text-[#2B1B42] dark:prose-li:text-[#00FF00]/80
        prose-img:rounded-lg prose-img:mx-auto prose-img:border-2 prose-img:border-[#553F7D] dark:prose-img:border-[#00FF00]
        prose-a:text-[#8A1F1F] hover:prose-a:text-[#FF6B00] dark:prose-a:text-[#FF6B00] dark:hover:prose-a:text-[#FF6B00]/80
        prose-del:text-[#553F7D]/50 dark:prose-del:text-[#00FF00]/50
        prose-blockquote:border-l-[#553F7D] dark:prose-blockquote:border-l-[#00FF00]
        prose-blockquote:text-[#553F7D] dark:prose-blockquote:text-[#00FF00]
        prose-code:text-[#FF6B00] dark:prose-code:text-[#A1FF6F]
        prose-pre:bg-[#2B1B42] dark:prose-pre:bg-[#2B1B42]
      ">
        <h1 className="text-4xl font-bold mb-4 text-[#553F7D] dark:text-[#A1FF6F]">
          {postData.title}
        </h1>
        <p className="text-sm text-[#2B1B42]/70 dark:text-[#00FF00]/70 mb-8">
          最后修改时间: {new Date(postData.date).toLocaleString('zh-CN')}
        </p>
        <div className="w-full">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
          >
            {postData.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
