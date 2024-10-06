import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // 确保这行存在
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 其余配置保持不变
    },
  },
};

export default config;
