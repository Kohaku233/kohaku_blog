"use client";

import Image from "next/image";
import type { ImgurImage } from "@/types/gallery";
import { useState, useEffect } from "react";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import BlurFade from "@/components/ui/blur-fade";

interface MasonryGridProps {
  className?: string;
}

export default function MasonryGrid({ className }: MasonryGridProps) {
  const [images, setImages] = useState<ImgurImage[]>([]);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [imageDimensions, setImageDimensions] = useState<
    Record<string, { width: number; height: number }>
  >({});

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/images");
        const data = await response.json();
        setImages(data.images);
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };
    fetchImages();
  }, []);

  const handleImageLoad = (
    imageKey: string,
    event: React.SyntheticEvent<HTMLImageElement>
  ) => {
    const img = event.target as HTMLImageElement;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // 获取原始尺寸和比例
    const originalWidth = img.naturalWidth;
    const originalHeight = img.naturalHeight;
    const aspectRatio = originalWidth / originalHeight;

    let displayWidth = originalWidth;
    let displayHeight = originalHeight;

    // 对于横向图片（宽度大于高度）
    if (aspectRatio > 1) {
      // 先按照宽度计算
      const minWidth = screenWidth * 0.9;
      displayWidth = Math.max(originalWidth, minWidth);
      displayHeight = displayWidth / aspectRatio;

      // 如果高度超过屏幕高度的90%，则按高度重新计算
      const maxHeight = screenHeight * 0.9;
      if (displayHeight > maxHeight) {
        displayHeight = maxHeight;
        displayWidth = displayHeight * aspectRatio;
      }
    } else {
      // 对于竖向图片，保持原始尺寸，但限制最大宽度
      const maxWidth = screenWidth * 0.8;
      if (displayWidth > maxWidth) {
        displayWidth = maxWidth;
        displayHeight = displayWidth / aspectRatio;
      }
    }

    setLoadedImages((prev) => new Set(prev).add(imageKey));
    setImageDimensions((prev) => ({
      ...prev,
      [imageKey]: {
        width: displayWidth,
        height: displayHeight,
      },
    }));
  };

  // 分配图片到两列，保持时间顺序并交错排列
  const distributeImages = (images: ImgurImage[]) => {
    const totalImages = images.length;
    const leftColumnCount = Math.floor((totalImages - 2) / 2);
    
    // 创建一个交错排列的数组，表示每个位置应该放在哪一列
    // true 表示左列，false 表示右列
    const positions = Array(totalImages).fill(false).map((_, index) => {
      if (index < leftColumnCount * 2) {
        return index % 2 === 0;
      }
      return false; // 剩余的都放右列
    });

    const leftColumn: ImgurImage[] = [];
    const rightColumn: ImgurImage[] = [];

    // 按照位置数组分配图片
    images.forEach((image, index) => {
      if (positions[index]) {
        leftColumn.push(image);
      } else {
        rightColumn.push(image);
      }
    });

    // 返回交错排列后的图片数组和它们的显示顺序
    return {
      leftColumn,
      rightColumn,
      displayOrder: positions.map((isLeft, index) => ({
        image: images[index],
        order: index
      }))
    };
  };

  const { leftColumn, rightColumn, displayOrder } = distributeImages(images);

  // 计算图片的延迟时间
  const getImageDelay = (image: ImgurImage) => {
    const index = displayOrder.findIndex(item => item.image.key === image.key);
    return 0.1 + index * 0.05;
  };

  return (
    <div className={className}>
      <Gallery>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 左列 */}
          <div className="flex flex-col gap-4">
            {leftColumn.map((image, idx) => (
              <Item
                key={image.key}
                original={image.url}
                thumbnail={image.url}
                width={imageDimensions[image.key]?.width || 0}
                height={imageDimensions[image.key]?.height || 0}
              >
                {({ ref, open }) => (
                  <div 
                    ref={ref} 
                    onClick={open} 
                    className="cursor-zoom-in"
                  >
                    <BlurFade delay={getImageDelay(image)}>
                      <div className="relative">
                        <Image
                          src={image.url}
                          alt={`Gallery image ${idx + 1}`}
                          width={800}
                          height={600}
                          className={`
                            w-full h-auto rounded-lg transition-all duration-300
                            ${
                              loadedImages.has(image.key)
                                ? "opacity-100 hover:scale-105"
                                : "opacity-0"
                            }
                          `}
                          style={{ height: "auto" }}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          quality={85}
                          priority={idx < 4}
                          onLoad={(event) => handleImageLoad(image.key, event)}
                        />
                      </div>
                    </BlurFade>
                  </div>
                )}
              </Item>
            ))}
          </div>

          {/* 右列 */}
          <div className="flex flex-col gap-4">
            {rightColumn.map((image, idx) => (
              <Item
                key={image.key}
                original={image.url}
                thumbnail={image.url}
                width={imageDimensions[image.key]?.width || 0}
                height={imageDimensions[image.key]?.height || 0}
              >
                {({ ref, open }) => (
                  <div 
                    ref={ref} 
                    onClick={open} 
                    className="cursor-zoom-in"
                  >
                    <BlurFade delay={getImageDelay(image)}>
                      <div className="relative">
                        <Image
                          src={image.url}
                          alt={`Gallery image ${idx + leftColumn.length + 1}`}
                          width={800}
                          height={600}
                          className={`
                            w-full h-auto rounded-lg transition-all duration-300
                            ${
                              loadedImages.has(image.key)
                                ? "opacity-100 hover:scale-105"
                                : "opacity-0"
                            }
                          `}
                          style={{ height: "auto" }}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          quality={85}
                          priority={idx < 4}
                          onLoad={(event) => handleImageLoad(image.key, event)}
                        />
                      </div>
                    </BlurFade>
                  </div>
                )}
              </Item>
            ))}
          </div>
        </div>
      </Gallery>
    </div>
  );
}
