"use client";

import Image from "next/image";
import type { ImgurImage } from "@/types/gallery";
import Masonry from "react-masonry-css";
import { useState, useEffect } from "react";
import BlurFade from "@/components/ui/blur-fade";

interface MasonryGridProps {
  className?: string;
}

export default function MasonryGrid({ className }: MasonryGridProps) {
  const [images, setImages] = useState<ImgurImage[]>([]);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  
  // 一次性获取所有图片
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

  const handleImageLoad = (imageKey: string) => {
    setLoadedImages((prev) => new Set(prev).add(imageKey));
  };

  const breakpointColumns = {
    default: 2,
    1100: 2,
    700: 1,
  };

  return (
    <div className={className}>
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex -ml-4 w-auto"
        columnClassName="pl-4 bg-clip-padding"
      >
        {images.map((image, idx) => (
          <div
            key={image.key}
            className="relative mb-4 cursor-zoom-in"
            onClick={() => setSelectedImage(image.url)}
          >
            <BlurFade delay={0.1 + idx * 0.05}>
              <div className="relative">
                {/* 模糊的缩略图背景 */}
                <div
                  className="absolute inset-0 blur-xl scale-110"
                  style={{
                    backgroundImage: `url(${image.url}?w=20)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: loadedImages.has(image.key) ? 0 : 1,
                    transition: "opacity 0.3s ease-in-out",
                  }}
                />

                {/* 高质量图片 */}
                <Image
                  src={image.url}
                  alt={`Gallery image ${idx + 1}`}
                  width={800}
                  height={0}
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
                  priority={idx < 4} // 优先加载前4张图片
                  onLoad={() => handleImageLoad(image.key)}
                />
              </div>
            </BlurFade>
          </div>
        ))}
      </Masonry>

      {/* 图片预览模态框 */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
