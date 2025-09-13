# 项目智能体指南（Agents）

本文件面向后续参与本仓库开发的“智能体/协作工程师”。内容涵盖项目架构总览、关键模块解读、开发约定、常见陷阱与改进建议，帮助你在最短时间内读懂代码并安全做改动。

## 一、项目概览
- 框架：Next.js 14 App Router（RSC 为默认渲染模型）
- 语言与工具：TypeScript、ESLint、Tailwind CSS（含 Typography 插件）
- UI 与动效：shadcn/ui（Radix primitives）、lucide-react、framer-motion
- 内容形态：Markdown（gray-matter 解析 frontmatter）+ RSC 版 MDX 渲染（next-mdx-remote/rsc）
- 评论系统：Giscus（随主题自适应明暗）
- 图像与画廊：Next Image 优化 + Imgur API（服务端抓取）+ Masonry 布局
- 主题：next-themes，`class` 切换
- 构建/部署：Next 原生脚本；缓存策略在 `next.config.mjs` 与部分页面/API 中配置

## 二、目录结构与职责
- `app/`：App Router 入口与各页面
  - `app/layout.tsx`: 根布局，注入 `ThemeProvider`、全局 `Layout`、`Toaster`
  - `app/page.tsx`: 首页动效与个人介绍
  - `app/blog/page.tsx`: 文章列表页（从 `lib/posts.ts` 读取元数据）
  - `app/blog/[slug]/page.tsx`: 文章详情页（MDX 渲染、目录、评论、锚点）
  - `app/gallery/page.tsx`: 图库页（服务端抓取 Imgur，5 分钟 ISR）
  - `app/projects/page.tsx`: 项目卡片展示
  - `app/api/images/route.ts`: Imgur 聚合图片 API（服务端缓存/边缘缓存 Header）
- `components/`：通用与页面级组件
  - `components/Layout.tsx`: 页面容器与头部导航注入
  - `components/Header.tsx`: 底部 Dock 风格导航、社媒、主题切换
  - `components/GiscusComments.tsx`: Giscus 评论（按主题切换）
  - `components/ui/*`: 按需封装的 UI 组件（代码块复制、TOC、表格、引用块、动效等）
- `lib/`
  - `lib/posts.ts`: Markdown 文件系统读取、frontmatter 解析、ToC 提取、内存级缓存
  - `lib/resume.ts`: 站点展示文案、导航与项目卡数据
  - `lib/utils.ts`: `cn` 合并类名与日期格式化
- `utils/`
  - `utils/imgur.ts`: Imgur API 拉取相册与图片（使用 `IMGUR_CLIENT_ID`）
- `posts/`: Markdown 文章（frontmatter 字段：`title`、`date`、`summary`、`slug`）
- 配置：`next.config.mjs`、`tailwind.config.ts`、`postcss.config.mjs`、`tsconfig.json`、`.eslintrc.json`

## 三、关键流转与技术要点
1) Markdown → 页面渲染
- 列表页：`app/blog/page.tsx` 通过 `getSortedPostsData()` 读取所有文章元信息，按 `date` 倒序展示。
- 详情页：
  - `generateStaticParams()` 由 `getAllPostSlugs()` 提供静态路由参数；
  - `generateMetadata()` 用文章 `title/summary/date` 生成 OG 元数据；
  - 渲染用 `MDXRemote`（RSC）+ `remark-gfm` + `rehype-slug` + `rehype-pretty-code`；
  - 自定义 MDX 组件：代码块包裹复制按钮、表格/引用块样式、标题锚点与 ToC 对齐。
- ToC 与锚点一致性：`lib/posts.ts` 使用与 `rehype-slug` 一致的 slug 算法，确保滚动定位精准。

2) 缓存与生成策略
- `lib/posts.ts`：进程内 `Map` 缓存（TTL 10 分钟）。注意：在 Serverless/多实例部署下，进程内缓存不共享。
- `app/gallery/page.tsx` 与 `app/api/images/route.ts`：`export const revalidate = 300`（ISR）+ `Cache-Control` 响应头，减轻 Imgur 请求负载。
- `next.config.mjs`：
  - 图片远程域白名单 `i.imgur.com`、`avatars.githubusercontent.com`；
  - 静态资源与文章路径缓存 Header；
  - `optimizePackageImports` 以减包体体积与编译时间。

3) 主题与 UI
- 主题由 `next-themes` 控制，`ModeToggle` 触发；`components.json` 指示使用 `shadcn/ui` 的 `new-york` 风格。
- 富文本样式：`tailwind-typography` 在 `tailwind.config.ts` 有大幅自定义（标题、列表、代码、表格、图片等）。

4) 图库与外部服务
- Imgur：`utils/imgur.ts` 通过账号相册分页抓取与图片聚合，需要环境变量 `IMGUR_CLIENT_ID`。
- 评论：`components/GiscusComments.tsx` 绑定仓库、分类与中英文设置，按 `resolvedTheme` 切换主题。

## 四、运行与环境
- 脚本：`package.json`
  - `dev`: `next dev --turbo`
  - `build`: `next build`
  - `start`: `next start`
  - `lint`: `next lint`
- 必需环境变量（参照 `.env.example`）
  - `IMGUR_CLIENT_ID`: Imgur API 访问用（服务端）
  - `NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`: 目前依赖已引入，代码中尚未直接使用。
- 本地开发：复制 `.env.example` 为 `.env.local`，填入实际值；运行 `npm run dev` 后访问 `http://localhost:3000`。

## 五、代码风格与协作约定
- TypeScript 严格模式；组件与工具函数均使用具名导出；避免使用一字母变量名。
- ESLint：基于 `next/core-web-vitals` + `next/typescript`，已关闭 `@next/next/no-img-element`；使用 `.eslintignore` 忽略构建产物。
- 样式：Tailwind 优先，复杂样式尽量收敛进可复用的 UI 组件；类名合并使用 `cn()`。
- 客户端组件须显式声明 `"use client"`；仅在需要交互/浏览器 API 时使用客户端组件。
- 文件/路由命名：App Router 语义化目录；动态路由置于 `[param]` 目录。
- 文章 frontmatter：必须包含 `title`、`date`（ISO 或可被 `Date` 解析）、`summary`；可选 `slug`（如未设定，使用文件名 URL 编码）。

## 六、常见陷阱与注意事项
- 进程内缓存：`lib/posts.ts` 的 `Map` 在多实例或无状态平台上不会共享；若需全局缓存，需引入 KV/Redis 或构建期静态化。
- RSC + `next-mdx-remote/rsc`：引入的客户端组件要谨慎，避免将大块 MDX 渲染从服务端“拉回”到客户端。
- 图片域名与缓存：新增外链图片时需在 `next.config.mjs` 中配置 `images.domains` 或 `remotePatterns`。
- Imgur 速率限制：图库页与 API 已加 ISR/缓存头，但加强并发控制或后端缓存仍是可选优化。
- SEO/可访问性：标题结构已良好，注意为图片提供合理 `alt`；链接与可点击元素保持键盘可达。

## 七、可演进方向（Roadmap）
- 构建期静态化
  - 将 Markdown 解析与 ToC 生成迁移到构建阶段，减少运行时开销
  - 可缓存渲染后的 MDX/HTML 片段
- 搜索与索引
  - 基于前端全文索引（如 minisearch）或构建期生成搜索索引
- 图片与资源
  - 图库结果落地缓存（KV/Redis/DB），或引入边缘函数
- 监控与质量
  - 引入 Sentry/Log 工具；Husky + lint-staged 做提交前检查
- 部署
  - Vercel/Cloudflare Pages，利用平台边缘缓存能力；设定 Preview/Prod 环境变量

## 八、改动指引（给智能体）
- 阅读顺序建议：
  1) `app/blog/[slug]/page.tsx:1`、`lib/posts.ts:1`
  2) `components/ui/mdx-components.tsx:1`、`components/ui/code-block.tsx:1`
  3) `app/api/images/route.ts:1`、`utils/imgur.ts:1`
  4) `next.config.mjs:1`、`tailwind.config.ts:1`
- 做改动前：
  - 明确是否涉及客户端组件与 RSC 边界
  - 如引入外部资源，先更新 `next.config.mjs` 的 images 白名单
  - 涉及文章数据结构时，确认 frontmatter 字段是否兼容现有渲染逻辑
- 做改动时：
  - 仅修改必要文件，遵循现有命名与风格
  - 性能相关改动需标注缓存策略与可能的副作用
- 自查清单：
  - `npm run build` 可通过；关键页面在本地可打开
  - 新增/变更环境变量是否记录在 `.env.example`
  - 组件是否误用客户端/服务端上下文（如 `window`、`fs`）

## 九、关键信息速查
- 文章读取与 ToC：`lib/posts.ts:1`
- 文章渲染页：`app/blog/[slug]/page.tsx:1`
- 文章列表页：`app/blog/page.tsx:1`
- 富文本/MDX 组件：`components/ui/mdx-components.tsx:1`
- 代码块复制：`components/ui/code-block.tsx:1`
- 目录组件（桌面/移动）：`components/ui/table-of-contents.tsx:1`、`components/ui/mobile-toc.tsx:1`
- 图库数据源（Imgur）：`utils/imgur.ts:1`、`app/api/images/route.ts:1`
- 全局主题/布局：`app/layout.tsx:1`、`components/Header.tsx:1`、`components/Layout.tsx:1`

—— 以上即为本项目的“最小充分认知”。如需我继续补充测试、CI、提交规范或进行性能基线评估，请提出具体需求。
