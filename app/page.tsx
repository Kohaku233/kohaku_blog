import { BlogCard } from '@/components/BlogCard';
import { getBlogPosts } from '@/lib/api';

export default async function HomePage() {
  const latestBlogs = await getBlogPosts();

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start justify-between">
        <div className="sm:w-1/2 pr-8">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-gray-900 dark:text-white">
            I&apos;m Kohaku
          </h1>
          <p className="text-xl sm:text-2xl mb-4 text-gray-800 dark:text-gray-200">
            An amateur programming enthusiast and long-term practitioner.
          </p>
        </div>
        <div className="sm:w-1/2 mt-8 sm:mt-0 flex justify-end">
          <div className="w-48 h-48 bg-black rounded-full flex items-center justify-center">
            <span
              className="text-white text-6xl font-bold"
              style={{ fontFamily: "Arial, sans-serif", fontStyle: "italic" }}
            >
              K
            </span>
          </div>
        </div>
      </div>
      <section className="mt-24">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Latest Articles
        </h2>
        <div className="grid sm:grid-cols-2 gap-8">
          {latestBlogs.slice(0, 2).map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </section>
    </div>
  );
}
