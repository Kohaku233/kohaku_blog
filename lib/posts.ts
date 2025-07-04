import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

// 定义文章的类型
export interface PostData {
  id: string;
  title: string;
  date: string;
  summary: string;
  slug?: string;
  fileName?: string;
  content?: string;
}

// 缓存对象
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 10; // 10分钟缓存

// 检查缓存是否有效
function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_TTL;
}

// 读取并解析所有 Markdown 文件的元数据
export function getSortedPostsData(): PostData[] {
  const cacheKey = 'sorted-posts-data';
  const cached = cache.get(cacheKey);
  
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data as PostData[];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // 使用 gray-matter 解析 Markdown 的 metadata
    const { data } = matter(fileContents);
    
    // 使用 slug 优先，如果没有则使用编码的文件名
    const slug = (data as { slug?: string }).slug || encodeURIComponent(fileName.replace(/\.md$/, ''));

    return {
      id: slug,
      fileName, // 保存原始文件名用于读取文件
      ...(data as Omit<PostData, 'id'>),
    };
  });

  const sortedData = allPostsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // 缓存结果
  cache.set(cacheKey, { data: sortedData, timestamp: Date.now() });
  
  return sortedData;
}

// 获取所有文章的 ID
export function getAllPostIds() {
  const cacheKey = 'all-post-ids';
  const cached = cache.get(cacheKey);
  
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data as Array<{ params: { slug: string } }>;
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const postIds = fileNames.map((fileName) => ({
    params: {
      slug: encodeURIComponent(fileName.replace(/\.md$/, '')),
    },
  }));
  
  // 缓存结果
  cache.set(cacheKey, { data: postIds, timestamp: Date.now() });
  
  return postIds;
}

// 获取所有文章的 slug（用于 generateStaticParams）
export function getAllPostSlugs(): string[] {
  const cacheKey = 'all-post-slugs';
  const cached = cache.get(cacheKey);
  
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data as string[];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const slugs = fileNames.map((fileName) => {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    
    // 使用 slug 优先，如果没有则使用编码的文件名
    return (data as { slug?: string }).slug || encodeURIComponent(fileName.replace(/\.md$/, ''));
  });
  
  // 缓存结果
  cache.set(cacheKey, { data: slugs, timestamp: Date.now() });
  
  return slugs;
}

// 获取单篇文章的完整数据
export async function getPostData(id: string): Promise<PostData> {
  const cacheKey = `post-${id}`;
  const cached = cache.get(cacheKey);
  
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data as PostData;
  }

  try {
    // 获取所有文章数据，找到对应的文件
    const allPosts = getSortedPostsData();
    const targetPost = allPosts.find(post => post.id === id);
    
    if (!targetPost || !targetPost.fileName) {
      // 如果没有找到，尝试用解码后的id作为文件名
      const decodedId = decodeURIComponent(id);
      const fallbackPath = path.join(postsDirectory, `${decodedId}.md`);
      
      if (fs.existsSync(fallbackPath)) {
        const fileContents = fs.readFileSync(fallbackPath, 'utf8');
        const { data, content } = matter(fileContents);
        
        const postData = {
          id,
          content,
          ...(data as Omit<PostData, 'id' | 'content'>),
        };
        
        cache.set(cacheKey, { data: postData, timestamp: Date.now() });
        return postData;
      }
      
      throw new Error(`Post not found: ${id}`);
    }
    
    const fullPath = path.join(postsDirectory, targetPost.fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    
    // 解析 Markdown 元数据和内容
    const { data, content } = matter(fileContents);

    const postData = {
      id,
      content,
      ...(data as Omit<PostData, 'id' | 'content'>),
    };
    
    // 缓存结果
    cache.set(cacheKey, { data: postData, timestamp: Date.now() });
    
    return postData;
  } catch (error) {
    console.error(`Error reading post ${id}:`, error);
    throw new Error(`Post not found: ${id}`);
  }
}
