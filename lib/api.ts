const API_URL = "http://localhost:2333/api";
export interface Blog {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  views: number;
}

export async function getBlogPosts(): Promise<Blog[]> {
  const res = await fetch(`${API_URL}/blogs`);
  if (!res.ok) {
    throw new Error("Failed to fetch blog posts");
  }
  const data = await res.json();
  return data.data;
}

export async function getBlogPost(id: number): Promise<Blog> {
  const res = await fetch(`${API_URL}/blogs/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch blog post");
  }
  const data = await res.json();
  return data.data;
}
