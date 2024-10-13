import { getPostData, getAllPostIds } from "@/lib/posts";
import ReactMarkdown from "react-markdown";

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
    <article className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
        {postData.title}
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
        最后修改时间: {new Date(postData.date).toLocaleString()}
      </p>
      <div className="text-lg text-gray-600 dark:text-gray-300 prose dark:prose-invert max-w-none">
        <ReactMarkdown>{postData.content}</ReactMarkdown>
      </div>
    </article>
  );
}
