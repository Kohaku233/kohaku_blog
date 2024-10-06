import Link from 'next/link';
import { getBlogPosts } from '@/lib/api';

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">博客文章</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="mb-4">
            <Link href={`/blog/${post.id}`} className="text-blue-500 hover:underline">
              <h2 className="text-xl font-semibold">{post.title}</h2>
            </Link>
            <p className="text-gray-600">{post.content.substring(0, 150)}...</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
