# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述
这是一个基于 Next.js 14 App Router 的个人博客网站，使用 TypeScript、Tailwind CSS、以及 Supabase 作为后端服务。

## 常用开发命令
- `npm run dev` - 启动开发服务器 (使用 Turbo 模式)
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行 ESLint 检查代码质量

## 项目架构

### 目录结构
- `/app` - Next.js App Router 页面和路由
  - `/blog` - 博客页面，支持动态路由 [slug]
  - `/gallery` - 图片展示页面，使用瀑布流布局
  - `/projects` - 项目展示页面
  - `/about` - 关于页面
  - `/api` - API 路由，包含图片处理接口
- `/components` - React 组件
  - `/auth` - 身份认证相关组件 (AuthProvider, LoginDialog)
  - `/comments` - 评论系统组件 (CommentSection, CommentForm, CommentItem)
  - `/ui` - 基于 Radix UI 的通用 UI 组件
- `/lib` - 核心业务逻辑
  - `supabase.ts` - Supabase 客户端配置和数据库类型定义
  - `posts.ts` - Markdown 博客文章处理逻辑
  - `actions.ts` - 服务器端操作
- `/posts` - Markdown 博客文章文件
- `/utils` - 工具函数 (日期格式化、Imgur 集成等)

### 技术栈核心特性
1. **内容管理**: 使用 gray-matter 解析 Markdown frontmatter，支持文章元数据
2. **身份认证**: Supabase Auth 集成，支持 GitHub OAuth 登录
3. **评论系统**: 完整的评论功能，包含点赞、回复、删除，使用 Supabase 实时订阅
4. **UI 组件**: 基于 Radix UI 构建，支持暗黑模式切换
5. **样式系统**: Tailwind CSS + 自定义字体 (ultralightitalic, FOTMatisseProUB)

### 数据库结构 (Supabase)
- `comments` 表：评论数据，支持嵌套回复和点赞功能
- `profiles` 表：用户资料信息

### 关键实现细节
1. **博客文章**: 存储在 `/posts` 目录，使用 URL 编码处理中文文件名
2. **评论系统**: 使用 Supabase 实时订阅，支持乐观更新策略
3. **图片处理**: 集成 Imgur API，支持图片上传和展示
4. **响应式设计**: 移动端优化，支持瀑布流布局

## 开发注意事项
- 评论系统使用实时订阅，避免手动刷新整个评论列表
- 图片组件使用 PhotoSwipe 实现放大查看功能
- 所有用户交互都有相应的 Toast 通知反馈
- 支持键盘快捷键和无障碍访问

## 环境变量需求
需要配置 Supabase 相关环境变量：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`