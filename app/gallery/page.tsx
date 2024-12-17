import MasonryGrid from "./components/MasonryGrid";
import BlurFade from "@/components/ui/blur-fade";

export default async function GalleryPage() {
  return (
    <div className="max-w-[688px] mx-auto px-4 sm:px-6 lg:px-8">
      <BlurFade>
        <h1 className="text-4xl font-bold mb-6">Picture</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 text-balance">
          记录日常生活的一些有意思的照片！
        </p>
      </BlurFade>
      <MasonryGrid />
    </div>
  );
}
