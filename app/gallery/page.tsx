import { Suspense } from "react";
import MasonryGrid from "./components/MasonryGrid";
import BlurFade from "@/components/ui/blur-fade";
import { getAllImages } from "@/utils/imgur";
import { Skeleton } from "@/components/ui/skeleton";

// 启用 ISR，每5分钟重新生成页面
export const revalidate = 300;

// 快速加载状态组件
function GalleryFallback() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, colIdx) => (
        <div key={colIdx} className="flex flex-col gap-4">
          {[300, 400, 250, 350].map((height, idx) => (
            <Skeleton 
              key={idx} 
              className="w-full rounded-lg animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" 
              style={{ height: `${height}px` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default async function GalleryPage() {
  // 在服务端获取数据
  const images = await getAllImages();
  
  return (
    <div className="max-w-[688px] mx-auto px-4 sm:px-6 lg:px-8">
      <BlurFade>
        <h1 className="text-4xl font-bold mb-6">Picture</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 text-balance">
          记录日常生活的一些有意思的照片！
        </p>
      </BlurFade>
      
      <Suspense fallback={<GalleryFallback />}>
        <MasonryGrid initialImages={images} />
      </Suspense>
    </div>
  );
}
