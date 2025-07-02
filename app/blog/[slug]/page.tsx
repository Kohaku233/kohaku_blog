import { getPostData, getAllPostSlugs } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import BlurFade from "@/components/ui/blur-fade";
import { formatDate } from "@/lib/utils";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import dynamic from "next/dynamic";
import { Metadata } from "next";

// 懒加载评论组件
const LazyCommentSection = dynamic(
  () => import("@/components/comments/LazyCommentSection"),
  { 
    ssr: false,
  }
);

// 生成静态参数
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

// 生成元数据
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const postData = await getPostData(params.slug);
    
    return {
      title: `${postData.title} | Kohaku`,
      description: postData.summary,
      openGraph: {
        title: postData.title,
        description: postData.summary,
        type: 'article',
        publishedTime: postData.date,
      },
    };
  } catch {
    return {
      title: 'Post Not Found | Kohaku',
      description: 'The requested blog post could not be found.',
    };
  }
}

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const postData = await getPostData(params.slug);

    // 优化后的 rehype-pretty-code 配置
    const rehypeOptions = {
      theme: "one-dark-pro",
      defaultLang: "plaintext",
      grid: false, // 减少DOM复杂度
      showLanguage: true,
      keepBackground: true,
      lineNumbers: false, // 减少DOM节点
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
            loading="lazy"
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
                  rehypePlugins: [[rehypePrettyCode, rehypeOptions]],
                  development: process.env.NODE_ENV === 'development',
                },
                parseFrontmatter: false, // 已在 getPostData 中处理
              }}
              components={components}
            />
          </div>
        </BlurFade>
      </article>

      {/* 评论部分 */}
      <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8">
        <LazyCommentSection postSlug={params.slug} />
      </div>
    </div>
    );
  } catch (error) {
    console.error('Error loading post:', error);
    return (
      <div className="max-w-[688px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            文章未找到
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            抱歉，请求的文章不存在或已被删除。
          </p>
        </div>
      </div>
    );
  }
}
