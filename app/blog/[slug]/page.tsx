import { getPostData } from "@/lib/posts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import BlurFade from "@/components/ui/blur-fade";

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const postData = await getPostData(params.slug);

  return (
    <div className="max-w-[688px] mx-auto px-4 sm:px-6 lg:px-8">
      <article className="prose prose-lg dark:prose-invert max-w-none
        prose-headings:font-semibold prose-a:text-blue-600 hover:prose-a:text-blue-500
        prose-img:rounded-lg prose-img:shadow-lg
      ">
        <BlurFade>
          <h1 className="text-4xl font-bold mb-4 text-[#553F7D] dark:text-[#A1FF6F]">
            {postData.title}
          </h1>
        </BlurFade>
        
        <BlurFade delay={0.2}>
          <p className="text-sm text-[#2B1B42]/70 dark:text-[#00FF00]/70 mb-8">
            最后修改时间: {new Date(postData.date).toLocaleString('zh-CN')}
          </p>
        </BlurFade>

        <BlurFade delay={0.3}>
          <div className="w-full">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
            >
              {postData.content}
            </ReactMarkdown>
          </div>
        </BlurFade>
      </article>
    </div>
  );
}
