import { Icons } from "@/components/Icons";

export const porfolio = {
  intro: "Hi, I'm ",
  name: "Kohaku 👋",
  description:["I am a long-termist who currently lives in Tokyo","and is also a software engineer who loves reading."],
};

export const navLinks = [
  { href: "/", icon: Icons.home, label: "Home" },
  { href: "/blog", icon: Icons.penTool, label: "Blog" },
  { href: "/projects", icon: Icons.box, label: "Projects" },
  { href: "/gallery", icon: Icons.pic, label: "Picture" },
];
export const socialLinks = [
  {
    href: "https://github.com/Kohaku233",
    icon: Icons.github,
    label: "Github",
  },
  { href: "https://x.com/AlwaysImproved", icon: Icons.x, label: "X" },
  {
    href: "https://www.youtube.com/@alwaysimproved5739",
    icon: Icons.youtube,
    label: "Youtube",
  },
];

export const projectCards = [
  {
    icon: Icons.sparkles,
    title: "Web3 基础入门",
    description: "Web3 基础入门",
    date: "2025-01-17",
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-500",
    href: "https://github.com/kohaku233",
    className:
      "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 !h-64 !w-[26rem] !px-6 !py-4 [&>p]:!whitespace-normal [&>p]:!leading-tight [&>div>p]:!text-xl",
  },
  {
    icon: Icons.sparkles,
    title: "大A港股历史收益率网站",
    description:
      "使用 Python 和 FastAPI 开发的股票数据分析网站，提供A股和港股的历史收益率数据分析和可视化功能。",
    date: "Future",
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-500",
    // href: "https://github.com/kohaku-chuan/stock",
    className:
      "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 !h-64 !w-[26rem] !px-6 !py-4 [&>p]:!whitespace-normal [&>p]:!leading-tight [&>div>p]:!text-xl",
  },
  {
    icon: Icons.sparkles,
    title: "Kohaku's Blog",
    description:
      "使用 Next.js 14 和 Tailwind CSS 开发的个人博客网站，包括主页、文章、项目以及照片展示等功能。采用了现代化的UI设计和动画效果。",
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-500",
    href: "https://github.com/kohaku233/kohaku_blog",
    image: "/web.png",
    className:
      "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10 !h-64 !w-[26rem] !px-6 !py-4 [&>p]:!whitespace-normal [&>p]:!leading-tight [&>div>p]:!text-xl",
  },
];