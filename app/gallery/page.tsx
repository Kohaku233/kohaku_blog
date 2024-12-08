import MasonryGrid from "./components/MasonryGrid";
import { getImgurImages } from "@/utils/imgur";
import type { ImgurImage } from "@/types/gallery";

async function getImages(limit: number = 6): Promise<{
  images: ImgurImage[];
}> {
  try {
    const images = await getImgurImages();
    return {
      images: images.slice(0, limit),
    };
  } catch (error) {
    console.error("Error fetching images:", error);
    return { images: [] };
  }
}

export default async function GalleryPage() {
  const initialData = await getImages(4);

  return (
    <div className="max-w-[688px] mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-6">Picture</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 text-balance">
        记录日常生活的一些有意思的照片！
      </p>

      <MasonryGrid
        initialImages={initialData.images}
      />
    </div>
  );
}
