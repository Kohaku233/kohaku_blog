import { getPostData } from "@/lib/posts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import BlurFade from "@/components/ui/blur-fade";
import { formatDate } from "@/lib/utils";

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
          <div className="text-lg text-gray-500 dark:text-gray-400">
            {formatDate(postData.date)}
          </div>
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
