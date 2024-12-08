interface ImgurImageResponse {
  id: string;
  link: string;
  datetime: number;
}

interface ImgurApiResponse {
  data: ImgurImageResponse[];
  success: boolean;
  status: number;
}

const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID!;
const IMGUR_ALBUM_HASH = process.env.IMGUR_ALBUM_HASH!;

export async function getImgurImages() {
  try {
    const response = await fetch(`https://api.imgur.com/3/album/${IMGUR_ALBUM_HASH}/images`, {
      headers: {
        'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json() as ImgurApiResponse;
    return data.data.map((image: ImgurImageResponse) => ({
      key: image.id,
      url: image.link,
      datetime: image.datetime,
    })).sort((a, b) => b.datetime - a.datetime);
    
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
} 