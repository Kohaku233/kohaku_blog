'use client';

import Image from 'next/image';
import type { S3Image } from '@/types/gallery';
import Masonry from 'react-masonry-css';
import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import BlurFade from "@/components/ui/blur-fade";

interface MasonryGridProps {
  initialImages: S3Image[];
  initialLastKey?: string;
}

export default function MasonryGrid({ initialImages, initialLastKey }: MasonryGridProps) {
  const [images, setImages] = useState<S3Image[]>(initialImages);
  const [lastKey, setLastKey] = useState<string | undefined>(initialLastKey);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 使用 ref 检测加载更多的触发器是否可见
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  const loadMoreImages = useCallback(async () => {
    if (loading || !lastKey) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/images?lastKey=${lastKey}`);
      const data = await response.json();
      
      setImages(prev => [...prev, ...data.images]);
      setLastKey(data.lastKey);
    } catch (error) {
      console.error('Error loading more images:', error);
    } finally {
      setLoading(false);
    }
  }, [lastKey, loading]);

  useEffect(() => {
    if (inView) {
      loadMoreImages();
    }
  }, [inView, loadMoreImages]);

  const breakpointColumns = {
    default: 2,
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
        {images.map((image, idx) => (
          <div 
            key={image.key} 
            className="relative mb-4 cursor-zoom-in"
            onClick={() => setSelectedImage(image.url)}
          >
            <BlurFade key={image.key} delay={0.25 + idx * 0.05} inView>
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
            </BlurFade>
          </div>
        ))}
      </Masonry>

      {/* 加载更多触发器 */}
      {lastKey && (
        <div ref={ref} className="w-full h-10 flex items-center justify-center">
          {loading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          )}
        </div>
      )}

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