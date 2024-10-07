"use client";

import { Dock, DockIcon } from "@/components/ui/dock";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaGithub, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import {
  LuBox,
  LuHome,
  LuMoon,
  LuPenTool,
  LuSun,
  LuUser,
} from "react-icons/lu";

import { useTheme } from "next-themes";
import Link from "next/link";

const navLinks = [
  { href: "/", icon: LuHome, label: "Home" },
  { href: "/blog", icon: LuPenTool, label: "Blog" },
  { href: "/projects", icon: LuBox, label: "Projects" },
  { href: "/about", icon: LuUser, label: "About" },
];
const socialLinks = [
  {
    href: "https://github.com/Kohaku233",
    icon: FaGithub,
    label: "Github",
  },
  { href: "https://x.com/AlwaysImproved", icon: FaXTwitter, label: "X" },
  {
    href: "https://www.youtube.com/@alwaysimproved5739",
    icon: FaYoutube,
    label: "Youtube",
  },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <header className="fixed bottom-0 left-0 right-0 flex justify-center p-2 sm:p-4 z-50">
      <TooltipProvider>
        <Dock
          magnification={60}
          distance={100}
          className="scale-75 sm:scale-100 transition-transform duration-300"
        >
          {navLinks.map((link) => (
            <DockIcon
              key={link.label}
              className="bg-black/10 dark:bg-white/10 p-2 sm:p-3"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={link.href} aria-label={link.label}>
                    <link.icon className="size-full" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{link.label}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}
          <Separator orientation="vertical" className="h-full py-2" />
          {socialLinks.map((link) => (
            <DockIcon
              key={link.label}
              className="bg-black/10 dark:bg-white/10 p-2 sm:p-3"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={link.href}
                    target="_blank"
                    aria-label={link.label}
                  >
                    <link.icon className="size-full" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{link.label}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}
          <Separator orientation="vertical" className="h-full py-2" />
          <DockIcon className="bg-black/10 dark:bg-white/10 p-1 sm:p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative w-5 h-5" onClick={toggleTheme}>
                  <LuSun
                    className="absolute w-full h-full transition-all duration-300 
                           rotate-0 scale-100 dark:-rotate-90 dark:scale-0"
                  />
                  <LuMoon
                    className="absolute w-full h-full transition-all duration-300 
                           rotate-90 scale-0 dark:rotate-0 dark:scale-100"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>切换主题</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        </Dock>
      </TooltipProvider>
    </header>
  );
}
