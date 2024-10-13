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
  content?: string;
}

// 读取并解析所有 Markdown 文件的元数据
export function getSortedPostsData(): PostData[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // 使用 gray-matter 解析 Markdown 的 metadata
    const { data } = matter(fileContents);

    return {
      id,
      ...data,
    } as PostData;
  });

  return allPostsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// 获取所有文章的 ID
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => ({
    params: {
      slug: fileName.replace(/\.md$/, ''),
    },
  }));
}

// 获取单篇文章的完整数据
export async function getPostData(id: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // 解析 Markdown 元数据和内容
  const { data, content } = matter(fileContents);


  return {
    id,
    content,
    ...data,
  } as PostData;
}
