import { ListObjectsV2Command, _Object } from "@aws-sdk/client-s3";
import { s3Client } from "@/utils/s3";
import MasonryGrid from "./components/MasonryGrid";
import type { S3Image } from "@/types/gallery";

// 获取指定数量的图片
async function getImages(
  limit: number = 6,
  startAfter?: string
): Promise<{
  images: S3Image[];
  lastKey?: string;
}> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME,
      MaxKeys: limit,
      StartAfter: startAfter,
    });

    const response = await s3Client.send(command);

    const images =
      response.Contents?.map((item: _Object) => ({
        key: item.Key || "",
        url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
      })) || [];

    return {
      images,
      lastKey: response.IsTruncated
        ? response.Contents?.slice(-1)[0].Key
        : undefined,
    };
  } catch (error) {
    console.error("Error fetching images:", error);
    return { images: [] };
  }
}

export default async function GalleryPage() {
  // 初始加载6张图片
  const initialData = await getImages(6);

  return (
    <div className="max-w-[688px] mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-6">Picture</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 text-balance">
        记录日常生活的一些有意思的照片！
      </p>

      <MasonryGrid
        initialImages={initialData.images}
        initialLastKey={initialData.lastKey}
      />
    </div>
  );
}
