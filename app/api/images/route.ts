import { getImgurImages } from '@/utils/imgur';
import { NextRequest, NextResponse } from 'next/server';

const IMAGES_PER_PAGE = 4;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  
  try {
    const allImages = await getImgurImages();
    const start = (page - 1) * IMAGES_PER_PAGE;
    const images = allImages.slice(start, start + IMAGES_PER_PAGE);
    
    return NextResponse.json({
      images,
      hasMore: start + IMAGES_PER_PAGE < allImages.length
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ images: [] }, { status: 500 });
  }
} 