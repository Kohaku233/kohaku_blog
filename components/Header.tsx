"use client";

import { Dock, DockIcon } from "@/components/ui/dock";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Link from "next/link";

import { navLinks, socialLinks } from "@/lib/resume";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "./ModeToggle";
import { LocaleToggle } from "./LocaleToggle";

export function Header() {
  return (
    <header className="fixed bottom-0 left-0 right-0 flex justify-center p-2 sm:p-4 z-50">
      <TooltipProvider>
        <Dock
          magnification={50}
          direction="middle"
          className="rounded-full scale-75 sm:scale-100 transition-transform duration-300 
                    border border-black/10 dark:border-white/5 
                     bg-white/30 dark:bg-zinc-900/70
                     backdrop-blur-xl gap-1 shadow-lg shadow-black/10 dark:shadow-white/5"
        >
          {navLinks.map((item) => (
            <DockIcon key={item.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-12 rounded-full"
                    )}
                  >
                    <item.icon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}
          <Separator
            orientation="vertical"
            className="h-full py-2 bg-gray-200/50 dark:bg-gray-700/50"
          />
          {socialLinks.map((item) => (
            <DockIcon key={item.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    target="_blank"
                    aria-label={item.label}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-12 rounded-full"
                    )}
                  >
                    <item.icon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}
          <Separator
            orientation="vertical"
            className="h-full py-2 bg-gray-200/50 dark:bg-gray-700/50"
          />
          <DockIcon>
            <LocaleToggle />
          </DockIcon>
          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                <ModeToggle />
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
