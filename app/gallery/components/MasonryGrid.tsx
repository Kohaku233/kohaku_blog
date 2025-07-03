"use client";

import Image from "next/image";
import type { ImgurImage } from "@/types/gallery";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import BlurFade from "@/components/ui/blur-fade";
import { Skeleton } from "@/components/ui/skeleton";
import { useInView } from "react-intersection-observer";

interface MasonryGridProps {
  className?: string;
  initialImages?: ImgurImage[];
}

interface ColumnImage extends ImgurImage {
  displayWidth: number;
  displayHeight: number;
}

interface Column {
  images: ColumnImage[];
  height: number;
}

// 懒加载图片组件 - 简化版本，消除闪烁
function LazyImage({ 
  image, 
  alt, 
  onLoad 
}: {
  image: ColumnImage;
  alt: string;
  onLoad: () => void;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '100px 0px',
  });
  
  const handleImageLoad = () => {
    setImageLoaded(true);
    onLoad();
  };
  
  return (
    <div ref={ref} className="relative overflow-hidden rounded-lg">
      {/* 占位符 - 使用正确的宽高比 */}
      <div 
        className={`w-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 transition-opacity duration-300 ${
          imageLoaded ? 'opacity-0' : 'opacity-100 animate-pulse'
        }`}
        style={{ 
          aspectRatio: `${image.width}/${image.height}`
        }}
      />
      
      {/* 实际图片 - 懒加载 */}
      {inView && (
        <Image
          src={image.link}
          alt={alt}
          width={image.width}
          height={image.height}
          className={`
            absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out
            ${imageLoaded 
              ? 'opacity-100' 
              : 'opacity-0'
            }
            hover:scale-[1.02] hover:transition-transform hover:duration-200
          `}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={85}
          priority={false}
          onLoad={handleImageLoad}
        />
      )}
    </div>
  );
}

export default function MasonryGrid({ className = "", initialImages = [] }: MasonryGridProps) {
  const [isLoading, setIsLoading] = useState(initialImages.length === 0);
  const [images, setImages] = useState<ColumnImage[]>([]);
  const [windowWidth, setWindowWidth] = useState(1200); // 设置合理的默认值

  // 响应式列数
  const columnCount = useMemo(() => {
    if (windowWidth < 640) return 1; // 手机
    if (windowWidth < 1024) return 2; // 平板
    return 3; // 桌面
  }, [windowWidth]);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize(); // 初始化
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 智能分布算法 - 平衡高度分布
  const columns = useMemo(() => {
    const cols: Column[] = Array.from({ length: columnCount }, () => ({
      images: [],
      height: 0,
    }));
    
    images.forEach((image) => {
      // 找到当前高度最小的列
      const shortestColIndex = cols.reduce((minIndex, col, index) => 
        col.height < cols[minIndex].height ? index : minIndex, 0
      );
      
      cols[shortestColIndex].images.push(image);
      // 使用宽高比来估算渲染高度
      const estimatedHeight = 300 * (image.height / image.width); // 假设基础宽度300px
      cols[shortestColIndex].height += estimatedHeight + 16; // 加上gap
    });
    
    return cols;
  }, [images, columnCount]);

  // 响应式骨架屏组件
  const SkeletonColumn = ({ columnIndex }: { columnIndex: number }) => {
    // 为每列生成不同高度的骨架屏，模拟真实的图片分布
    const heights = [
      [300, 400, 250, 350, 280], // 第一列
      [350, 280, 380, 220, 320], // 第二列  
      [250, 360, 300, 400, 260], // 第三列
    ];
    
    const columnHeights = heights[columnIndex % 3] || heights[0];
    
    return (
      <div className="flex flex-col gap-4">
        {columnHeights.map((height, idx) => (
          <Skeleton 
            key={idx} 
            className="w-full rounded-lg animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" 
            style={{ height: `${height}px` }}
          />
        ))}
      </div>
    );
  };

  // 处理图片数据的函数 - 简化版本
  const processImages = useCallback((rawImages: ImgurImage[]) => {
    return rawImages
      .sort(
        (a: ImgurImage, b: ImgurImage) =>
          new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
      )
      .map((img: ImgurImage): ColumnImage => {
        // 简化尺寸计算，让CSS处理响应式
        return {
          ...img,
          displayWidth: img.width,
          displayHeight: img.height,
        };
      });
  }, []);

  // 初始化图片数据
  useEffect(() => {
    if (initialImages.length > 0) {
      // 如果有初始数据，直接使用
      setImages(processImages(initialImages));
      setIsLoading(false);
    } else {
      // 如果没有初始数据，从 API 获取
      const fetchImages = async () => {
        setIsLoading(true);
        try {
          const response = await fetch("/api/images");
          const data = await response.json();
          setImages(processImages(data.images));
        } catch (error) {
          console.error("Error loading images:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchImages();
    }
  }, [initialImages, processImages]);

  // 移除窗口大小变化时的重新计算，避免布局抖动


  const handleImageLoad = () => {
    // 图片加载完成回调，可用于加载状态管理
  };

  // 波浪式动画延迟计算 - 更自然的加载节奏
  const getStaggeredDelay = (colIdx: number, imgIdx: number) => {
    // 实现对角线波浪效果：每条对角线上的图片几乎同时显示
    const diagonalIndex = colIdx + imgIdx;
    const positionInDiagonal = colIdx;
    
    // 基础延迟：每条对角线延迟200ms
    const diagonalDelay = diagonalIndex * 0.2;
    
    // 对角线内部的微小延迟：让同一对角线的图片有轻微错开
    const internalDelay = positionInDiagonal * 0.03;
    
    // 添加一些随机性，让动画更自然
    const randomOffset = (colIdx * 7 + imgIdx * 3) % 10 * 0.01;
    
    const maxDelay = 2.0; // 最大延迟2秒
    
    return Math.min(diagonalDelay + internalDelay + randomOffset, maxDelay);
  };

  // 计算网格样式
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  }[columnCount] || 'grid-cols-1 sm:grid-cols-2';

  return (
    <div className={className}>
      <Gallery>
        <div className={`grid ${gridCols} gap-4 items-start`}>
          {isLoading && images.length === 0 ? (
            // 显示加载状态
            Array.from({ length: columnCount }).map((_, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-4">
                <SkeletonColumn columnIndex={colIdx} />
              </div>
            ))
          ) : (
            // 显示图片内容
            columns.map((column, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-4">
                {column.images.map((image, imgIdx) => {
                  return (
                    <Item
                      key={image.id}
                      original={image.link}
                      thumbnail={image.link}
                      width={image.width}
                      height={image.height}
                    >
                      {({ ref, open }) => (
                        <div ref={ref} onClick={open} className="cursor-zoom-in">
                          <BlurFade 
                            delay={getStaggeredDelay(colIdx, imgIdx)}
                            className="h-full"
                          >
                            <LazyImage
                              image={image}
                              alt={`Gallery image ${colIdx}-${imgIdx}`}
                              onLoad={handleImageLoad}
                            />
                          </BlurFade>
                        </div>
                      )}
                    </Item>
                  );
                })}
              </div>
            ))
          )}
        </div>
        
        {/* 可爱的加载完成装饰 */}
        {!isLoading && images.length > 0 && (
          <div className="mt-16 mb-8 flex flex-col items-center space-y-4">
            {/* 装饰线 */}
            <div className="flex items-center space-x-4 w-full max-w-md">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-300 to-pink-400 dark:via-pink-600 dark:to-pink-500" />
              <div className="text-2xl animate-bounce">🌸</div>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-pink-300 to-pink-400 dark:via-pink-600 dark:to-pink-500" />
            </div>
            
            {/* 文字提示 */}
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                ✨ 所有照片已加载完成 ✨
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                感谢您的浏览，希望您喜欢这些美好的瞬间 😊
              </p>
            </div>
            
            {/* 小装饰图标 */}
            <div className="flex items-center space-x-2 mt-4">
              <span className="text-lg animate-pulse">🌿</span>
              <span className="text-lg animate-pulse" style={{animationDelay: '0.3s'}}>🌺</span>
              <span className="text-lg animate-pulse" style={{animationDelay: '0.6s'}}>🌿</span>
            </div>
          </div>
        )}
      </Gallery>
    </div>
  );
}
