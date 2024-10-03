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
  views: number;
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

  // 其他方法保持不变...
};