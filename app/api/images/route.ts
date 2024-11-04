import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { s3Client } from '@/utils/s3';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lastKey = searchParams.get('lastKey');
  const limit = 6;

  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME,
      MaxKeys: limit,
      StartAfter: lastKey || undefined
    });
    
    const response = await s3Client.send(command);
    
    const images = response.Contents?.map((item) => ({
      key: item.Key || '',
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
    })) || [];

    return NextResponse.json({
      images,
      lastKey: response.IsTruncated ? response.Contents?.slice(-1)[0].Key : undefined
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ images: [] }, { status: 500 });
  }
} 