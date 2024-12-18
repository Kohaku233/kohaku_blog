"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  // 解析内容中的标题
  useEffect(() => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const matches = Array.from(content.matchAll(headingRegex));
    const parsedHeadings = matches.map((match) => {
      const level = match[1].length;
      const text = match[2];
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return { id, text, level };
    });
    setHeadings(parsedHeadings);
  }, [content]);

  // 监听滚动，高亮当前标题
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    const headingElements = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    headingElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden lg:block fixed right-8 top-20 w-64">
      <div className="space-y-2 pb-8">
        <p className="font-medium text-sm text-muted-foreground mb-4">目录</p>
        <ul className="space-y-2 text-sm">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}
            >
              <a
                href={`#${heading.id}`}
                className={cn(
                  "block text-muted-foreground hover:text-foreground transition-colors",
                  activeId === heading.id && "text-foreground font-medium"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(`#${heading.id}`)?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
} 