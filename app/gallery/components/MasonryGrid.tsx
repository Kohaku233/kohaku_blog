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

  return (
    <div className={className}>
      <Gallery>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {images.map((image, idx) => (
            <Item
              key={image.key}
              original={image.url}
              thumbnail={image.url}
              width={imageDimensions[image.key]?.width || 0}
              height={imageDimensions[image.key]?.height || 0}
            >
              {({ ref, open }) => (
                <div ref={ref} onClick={open} className="cursor-zoom-in">
                  <BlurFade delay={0.1 + idx * 0.05}>
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
      </Gallery>
    </div>
  );
}
