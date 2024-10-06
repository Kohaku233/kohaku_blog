import { BlogPost } from "@/components/BlogPost";

interface BlogPageProps {
  params: {
    id: string;
  };
}

export default function BlogPage({ params }: BlogPageProps) {
  const { id } = params;
  return <BlogPost id={parseInt(id, 10)} />;
}
