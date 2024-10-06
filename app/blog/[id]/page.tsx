import { getBlogPost } from '@/lib/api';
import { BlogPost } from '@/components/BlogPost';

interface BlogPageProps {
  params: {
    id: string;
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { id } = params;
  const post = await getBlogPost(parseInt(id, 10));
  
  return <BlogPost blog={post} />;
}
