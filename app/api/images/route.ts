import { getAllImages } from "@/utils/imgur";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const images = await getAllImages();
    return NextResponse.json({
      images
    });
  } catch (error) {
    console.error("Error in /api/images:", error);
    return NextResponse.json({ images: [] });
  }
}