"use client";

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Giscus from '@giscus/react';

interface GiscusCommentsProps {
  slug: string;
}

export default function GiscusComments({ slug }: GiscusCommentsProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="mt-12 w-full">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-semibold">评论区加载中...</h2>
        </div>
      </div>
    );
  }

  const giscusTheme = resolvedTheme === 'dark' ? 'dark' : 'light';

  return (
    <div className="mt-12 w-full">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-semibold">评论区</h2>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
        <Giscus
          key={slug} // 只使用 slug 作为 key，主题变化不会重新渲染
          repo="Kohaku233/kohaku_blog"
          repoId="R_kgDOM0_Tdw"
          category="General"
          categoryId="DIC_kwDOM0_Td84Ctzsv"
          mapping="pathname"
          strict="0"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme={giscusTheme}
          lang="zh-CN"
          loading="lazy"
        />
      </div>
    </div>
  );
}