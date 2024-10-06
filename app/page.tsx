import Link from "next/link";
import { getBlogPosts } from "@/lib/api";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function HomePage() {
  const latestBlogs = await getBlogPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-16">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/avatar.png" alt="Kohaku" />
            <AvatarFallback>K</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-4xl font-bold">Kohaku</h1>
            <p className="text-xl text-muted-foreground">
              An amateur programming enthusiast and long-term practitioner.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8">Latest Articles</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {latestBlogs.slice(0, 2).map((blog) => (
            <Card key={blog.id}>
              <CardHeader>
                <CardTitle>{blog.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {blog.content.substring(0, 100)}...
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href={`/blog/${blog.id}`}>Read more</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
