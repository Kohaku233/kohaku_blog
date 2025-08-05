import { getPostData, getAllPostSlugs } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import BlurFade from "@/components/ui/blur-fade";
import { formatDate } from "@/lib/utils";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { InlineCode, CodeBlock } from "@/components/ui/code-block";
import { 
  Blockquote, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableHeader, 
  TableCell, 
  Divider,
  HeadingWithAnchor 
} from "@/components/ui/mdx-components";
import { TableOfContents } from "@/components/ui/table-of-contents";
import { MobileToc } from "@/components/ui/mobile-toc";

// 懒加载 Giscus 评论组件
const GiscusComments = dynamic(
  () => import("@/components/GiscusComments"),
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

    // 简化的 rehype-pretty-code 配置
    const rehypeOptions = {
      theme: "github-dark",
      keepBackground: true
    };

    // 自定义组件
    const components = {
      // 图片组件
      img: ({ src, alt, ...props }: { src?: string; alt?: string }) => (
        <Zoom>
          <img
            src={src}
            alt={alt}
            className="w-full rounded-lg transition-opacity hover:opacity-90 shadow-lg"
            loading="lazy"
            {...props}
          />
        </Zoom>
      ),
      // 代码块组件
      pre: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => {
        const language = props["data-language"] as string || "plaintext";
        return (
          <CodeBlock language={language} {...props}>
            {children as React.ReactNode}
          </CodeBlock>
        );
      },
      // 内联代码组件
      code: ({ children, className, ...props }: { children: React.ReactNode; className?: string; [key: string]: unknown }) => {
        // 如果是在 pre 标签内，直接返回原始 code
        if (className?.includes("language-")) {
          return <code className={className} {...props}>{children}</code>;
        }
        // 否则使用自定义内联代码组件
        return <InlineCode>{children}</InlineCode>;
      },
      // 表格组件
      table: Table,
      thead: TableHead,
      tbody: TableBody,
      tr: TableRow,
      th: TableHeader,
      td: TableCell,
      // 引用块组件
      blockquote: Blockquote,
      // 分隔线组件
      hr: Divider,
      // 标题组件
      h1: (props: React.ComponentProps<"h1">) => <HeadingWithAnchor level={1} {...props} />,
      h2: (props: React.ComponentProps<"h2">) => <HeadingWithAnchor level={2} {...props} />,
      h3: (props: React.ComponentProps<"h3">) => <HeadingWithAnchor level={3} {...props} />,
      h4: (props: React.ComponentProps<"h4">) => <HeadingWithAnchor level={4} {...props} />,
      h5: (props: React.ComponentProps<"h5">) => <HeadingWithAnchor level={5} {...props} />,
      h6: (props: React.ComponentProps<"h6">) => <HeadingWithAnchor level={6} {...props} />,
    };

    return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:flex lg:gap-8">
        {/* 主内容区域 */}
        <div className="lg:flex-1 lg:max-w-4xl">
          <article className="prose prose-lg prose-zinc dark:prose-invert max-w-none">
            {/* 文章头部 */}
            <header className="mb-12 text-center border-b border-gray-200 dark:border-gray-800 pb-8">
              <BlurFade>
                <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100 leading-tight">
                  {postData.title}
                </h1>
              </BlurFade>

              <BlurFade delay={0.2}>
                <div className="text-base text-gray-600 dark:text-gray-400 font-medium">
                  {formatDate(postData.date)}
                </div>
              </BlurFade>
            </header>

            {/* 文章内容 */}
            <BlurFade delay={0.3}>
              <div className="prose-content">
                <MDXRemote
                  source={postData.content || ""}
                  options={{
                    mdxOptions: {
                      remarkPlugins: [remarkGfm],
                      rehypePlugins: [
                        rehypeSlug,
                        [rehypePrettyCode, rehypeOptions]
                      ],
                      development: process.env.NODE_ENV === 'development',
                    },
                    parseFrontmatter: false,
                  }}
                  // @ts-expect-error - Custom component types don't match MDX types exactly
                  components={components}
                />
              </div>
            </BlurFade>
          </article>

          {/* 评论部分 */}
          <aside className="border-t border-gray-200 dark:border-gray-800 mt-16 pt-8">
            <GiscusComments slug={params.slug} />
          </aside>
        </div>

        {/* ToC 侧边栏 */}
        {postData.toc && postData.toc.length > 0 && (
          <aside className="hidden lg:block lg:w-64 lg:flex-shrink-0">
            <div className="sticky top-8">
              <TableOfContents toc={postData.toc} />
            </div>
          </aside>
        )}
      </div>

      {/* 移动端 ToC */}
      <MobileToc toc={postData.toc || []} />
    </div>
    );
  } catch (error) {
    console.error('Error loading post:', error);
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
