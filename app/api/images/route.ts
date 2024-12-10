import { getImgurImages } from '@/utils/imgur';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

export async function GET() {
  try {
    const images = await getImgurImages();
    return NextResponse.json({
      images,
      total: images.length
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ 
      images: [], 
      total: 0 
    }, { 
      status: 500 
    });
  }
}