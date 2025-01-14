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

interface ColumnImage extends ImgurImage {
  displayWidth: number;
  displayHeight: number;
}

interface Column {
  images: ColumnImage[];
}

export default function MasonryGrid({ className }: MasonryGridProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [columns, setColumns] = useState<{
    left: Column;
    right: Column;
  }>({
    left: { images: [] },
    right: { images: [] },
  });

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/images");
        const data = await response.json();

        // 按时间排序并计算显示尺寸
        const sortedImages = data.images
          .sort(
            (a: ImgurImage, b: ImgurImage) =>
              new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
          )
          .map((img: ImgurImage): ColumnImage => {
            // 计算显示尺寸，保持宽高比
            const displayWidth = 600; // 设置统一的显示宽度
            const aspectRatio = img.width / img.height;
            const displayHeight = displayWidth / aspectRatio;

            return {
              ...img,
              displayWidth,
              displayHeight,
            };
          });

        // 动态分配图片到两列
        const { leftColumn, rightColumn } = distributeImages(sortedImages);
        setColumns({
          left: {
            images: leftColumn,
          },
          right: {
            images: rightColumn,
          },
        });
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };
    fetchImages();
  }, []);

  // 分配图片到两列，尽量保持高度平衡
  const distributeImages = (images: ColumnImage[]) => {
    const leftColumn: ColumnImage[] = [];
    const rightColumn: ColumnImage[] = [];
    let leftHeight = 0;
    let rightHeight = 0;
    const gap = 16;

    images.forEach((image) => {
      // 计算添加这张图片后的列高
      const imageHeight = image.displayHeight + gap;

      // 将图片添加到高度较小的列
      if (leftHeight <= rightHeight) {
        leftColumn.push(image);
        leftHeight += imageHeight;
      } else {
        rightColumn.push(image);
        rightHeight += imageHeight;
      }
    });

    return { leftColumn, rightColumn };
  };

  const handleImageLoad = (imageKey: string) => {
    setLoadedImages((prev) => new Set(prev).add(imageKey));
  };

  // 重新设计加载延迟计算函数
  const getLoadDelay = (
    leftIdx: number,
    _: number,
    isRightColumn: boolean
  ) => {
    if (isRightColumn) {
      // 右列图片的实际序号应该是 leftIdx 对应的左列图片之后
      return (leftIdx * 2 + 1) * 0.05;
    }
    // 左列图片的序号就是它的索引 * 2
    return leftIdx * 2 * 0.05;
  };

  return (
    <div className={className}>
      <Gallery>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 左列 */}
          <div className="flex flex-col gap-4">
            {columns.left.images.map((image, idx) => (
              <Item
                key={image.id}
                original={image.link}
                thumbnail={image.link}
                width={image.width}
                height={image.height}
              >
                {({ ref, open }) => (
                  <div ref={ref} onClick={open} className="cursor-zoom-in">
                    <BlurFade delay={getLoadDelay(idx, idx, false)}>
                      <div className="relative">
                        <Image
                          src={image.link}
                          alt={`Gallery image ${idx + 1}`}
                          width={image.width}
                          height={image.height}
                          className={`
                            w-full h-auto rounded-lg transition-all duration-300
                            ${
                              loadedImages.has(image.id)
                                ? "opacity-100 hover:scale-105"
                                : "opacity-0"
                            }
                          `}
                          style={{ height: "auto" }}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          quality={85}
                          priority={idx < 4}
                          onLoad={() => handleImageLoad(image.id)}
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
            {columns.right.images.map((image, idx) => (
              <Item
                key={image.id}
                original={image.link}
                thumbnail={image.link}
                width={image.width}
                height={image.height}
              >
                {({ ref, open }) => (
                  <div ref={ref} onClick={open} className="cursor-zoom-in">
                    <BlurFade delay={getLoadDelay(idx, idx, true)}>
                      <div className="relative">
                        <Image
                          src={image.link}
                          alt={`Gallery image ${
                            idx + columns.left.images.length + 1
                          }`}
                          width={image.width}
                          height={image.height}
                          className={`
                            w-full h-auto rounded-lg transition-all duration-300
                            ${
                              loadedImages.has(image.id)
                                ? "opacity-100 hover:scale-105"
                                : "opacity-0"
                            }
                          `}
                          style={{ height: "auto" }}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          quality={85}
                          priority={idx < 4}
                          onLoad={() => handleImageLoad(image.id)}
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
