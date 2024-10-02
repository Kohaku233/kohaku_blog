import axios from 'axios';

const API_BASE_URL = 'http://localhost:2333/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Blog {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  views: number; // 添加这行
}

export const blogApi = {
  // 获取所有博客
  getAllBlogs: async (): Promise<Blog[]> => {
    const response = await api.get('/blogs');
    return response.data.data;
  },

  // 获取单个博客
  getBlogById: async (id: number): Promise<Blog> => {
    const response = await api.get(`/blogs/${id}`);
    return response.data.data;
  },

  // 创建博客
  createBlog: async (title: string, content: string): Promise<number> => {
    const response = await api.post('/blogs', { title, content });
    return response.data.blogId;
  },

  // 更新博客
  updateBlog: async (id: number, title: string, content: string): Promise<void> => {
    await api.put(`/blogs/${id}`, { title, content });
  },

  // 删除博客
  deleteBlog: async (id: number): Promise<void> => {
    await api.delete(`/blogs/${id}`);
  },
};