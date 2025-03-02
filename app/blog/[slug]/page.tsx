import { getPostData } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import BlurFade from "@/components/ui/blur-fade";
import { formatDate } from "@/lib/utils";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import dynamic from "next/dynamic";

// 动态导入评论组件以避免SSR问题
const CommentSection = dynamic(
  () => import("@/components/comments/CommentSection"),
  { ssr: false }
);

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const postData = await getPostData(params.slug);

  const options = {
    theme: "one-dark-pro",
    defaultLang: "plaintext",
    grid: true,
    showLanguage: true,
    keepBackground: true,
    lineNumbers: true,
  };

  // 自定义组件
  const components = {
    // 图片组件
    img: ({ src, alt, ...props }: { src?: string; alt?: string }) => (
      <Zoom>
        <img
          src={src}
          alt={alt}
          className="w-full rounded-lg transition-opacity hover:opacity-90"
          {...props}
        />
      </Zoom>
    ),
  };

  return (
    <div className="max-w-[688px] mx-auto px-4 sm:px-6 lg:px-8">
      <article
        className="prose-zinc prose-lg dark:prose-invert max-w-none
          prose-headings:font-semibold 
          prose-a:text-blue-600 hover:prose-a:text-blue-500
          prose-img:rounded-lg prose-img:shadow-lg
          prose-strong:text-red-600 dark:prose-strong:text-red-400
          prose-pre:px-4 prose-pre:py-4
          prose-pre:bg-[#1e1e1e]
          prose-pre:my-8
          prose-code:text-blue-500
          [&_pre]:relative
        "
      >
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
            <MDXRemote
              source={postData.content || ""}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [[rehypePrettyCode, options]],
                },
              }}
              components={components}
            />
          </div>
        </BlurFade>
      </article>

      {/* 评论部分 */}
      <div className=" border-gray-200 dark:border-gray-800 mt-8 pt-8">
        <CommentSection postSlug={params.slug} />
      </div>
    </div>
  );
}
