import Link from 'next/link'
import { getBlogPosts } from '@/lib/api'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function BlogPage() {
  const blogs = await getBlogPosts()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid gap-6 sm:grid-cols-2">
        {blogs.map((blog) => (
          <Card key={blog.id}>
            <CardHeader>
              <CardTitle>{blog.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{blog.content.substring(0, 100)}...</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href={`/blog/${blog.id}`}>Read more</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}