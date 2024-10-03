import { useRouter } from 'next/router';
import { BlogPost } from '@/components/BlogPost';

export default function BlogPage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id || typeof id !== 'string') {
    return <div>加载中...</div>;
  }

  return <BlogPost id={parseInt(id, 10)} />;
}