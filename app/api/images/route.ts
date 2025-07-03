import { getAllImages } from "@/utils/imgur";
import { NextResponse } from "next/server";

// 设置合理的缓存时间 - 5分钟重新验证
export const revalidate = 300;

export async function GET() {
  try {
    const images = await getAllImages();
    
    // 设置合理的缓存策略
    return NextResponse.json(
      { images },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error("Error in /api/images:", error);
    return NextResponse.json({ images: [] });
  }
}