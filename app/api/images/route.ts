import { getAllImages } from "@/utils/imgur";
import { NextResponse } from "next/server";

// 添加这个导出以禁用路由缓存
export const dynamic = 'force-dynamic';
// 可选：如果需要更精细控制，也可以使用这些选项
// export const revalidate = 0;
// export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    // 添加时间戳参数来确保每次请求都是新的
    const images = await getAllImages();
    
    // 设置响应头以防止客户端缓存
    return NextResponse.json(
      { images },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error("Error in /api/images:", error);
    return NextResponse.json({ images: [] });
  }
}