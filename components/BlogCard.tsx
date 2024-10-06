import Link from "next/link";
import { PenTool, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Blog } from "@/lib/api";

export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link href={`/blog/${blog.id}`} key={blog.id}>
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden 
              cursor-pointer hover:shadow-xl transition-shadow duration-300"
      >
        <div className="p-6">
          <div
            className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4 pb-2 
                  border-b border-gray-200 dark:border-gray-700"
          >
            <PenTool className="h-4 w-4 mr-1" />
            <span>Blog</span>
          </div>
          <div
            className="flex justify-between items-center text-sm text-gray-600 
                  dark:text-gray-400 mb-2"
          >
            <span>{new Date(blog.created_at).toLocaleDateString()}</span>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              <span>{blog.views || 0} views</span>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            {blog.title}
          </h3>
          <div className="text-gray-600 dark:text-gray-400 mb-4 prose dark:prose-invert">
            <ReactMarkdown>
              {blog.content.substring(0, 150) +
                (blog.content.length > 150 ? "..." : "")}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </Link>
  );
}
