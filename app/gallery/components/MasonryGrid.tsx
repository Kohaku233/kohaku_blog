'use client';

import Image from 'next/image';
import type { S3Image } from '@/types/gallery';
import Masonry from 'react-masonry-css';
import { useState } from 'react';

interface MasonryGridProps {
  images: S3Image[];
}

export default function MasonryGrid({ images }: MasonryGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const breakpointColumns = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex -ml-4 w-auto"
        columnClassName="pl-4 bg-clip-padding"
      >
        {images.map((image) => (
          <div 
            key={image.key} 
            className="relative mb-4 cursor-zoom-in"
            onClick={() => setSelectedImage(image.url)}
          >
            <Image
              src={image.url}
              alt={image.key}
              width={800}
              height={0}
              className="w-full h-auto hover:scale-105 transition-transform duration-300 rounded-lg"
              style={{ height: 'auto' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              quality={85}
            />
          </div>
        ))}
      </Masonry>

      {/* 图片预览模态框 */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] overflow-auto">
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
            {/* 使用原生 img 标签来显示原始图片 */}
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
} 