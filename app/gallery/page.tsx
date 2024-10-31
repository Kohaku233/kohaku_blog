import { ListObjectsV2Command, _Object } from '@aws-sdk/client-s3';
import { s3Client } from '@/utils/s3';
import MasonryGrid from './components/MasonryGrid';
import type { S3Image } from '@/types/gallery';

async function getImages(): Promise<S3Image[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME,
    });
    
    const response = await s3Client.send(command);
    
    return response.Contents?.map((item: _Object) => ({
      key: item.Key || '',
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
    })) || [];
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

export default async function GalleryPage() {
  const images = await getImages();

  return (
    <div className="max-w-[688px] mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-6">Picture</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 text-balance">
        我在在东京的一些有意思的照片！
      </p>
      
      <MasonryGrid images={images} />
    </div>
  );
}
