interface ImgurAlbum {
  id: string;
  datetime: number;
}

interface ImgurImage {
  id: string;
  datetime: number;
  width: number;
  height: number;
  link: string;
}

const username = '0xredpill'

// 获取所有相册
async function fetchAlbums(username: string): Promise<ImgurAlbum[]> {
  let allAlbums: ImgurAlbum[] = [];
  let page = 0;
  let hasMore = true;

  while (hasMore) {
    try {
      const response = await fetch(
        `https://api.imgur.com/3/account/${username}/albums/${page}`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const albums = data.data as ImgurAlbum[];

      if (albums.length === 0) {
        hasMore = false;
      } else {
        allAlbums = [...allAlbums, ...albums];
        page++;
      }
    } catch (error) {
      console.error("Error fetching albums:", error);
      hasMore = false;
    }
  }

  // 按时间排序
  return allAlbums.sort((a, b) => b.datetime - a.datetime);
}

// 获取相册中的图片
async function fetchAlbumImages(albumId: string): Promise<ImgurImage[]> {
  try {
    const response = await fetch(
      `https://api.imgur.com/3/album/${albumId}/images`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data.map((image: ImgurImage) => ({
      id: image.id,
      datetime: image.datetime,
      width: image.width,
      height: image.height,
      link: image.link,
    }));
  } catch (error) {
    console.error(`Error fetching images for album ${albumId}:`, error);
    return [];
  }
}

// 获取所有相册的所有图片
export async function getAllImages(): Promise<ImgurImage[]> {
  try {
    // 1. 获取所有相册
    const albums = await fetchAlbums(username);

    // 2. 获取所有相册的图片
    const allImagesPromises = albums.map(album => fetchAlbumImages(album.id));
    const allImagesArrays = await Promise.all(allImagesPromises);

    // 3. 合并所有图片并按时间排序
    const allImages = allImagesArrays
      .flat()
      .sort((a, b) => b.datetime - a.datetime);

    return allImages;
  } catch (error) {
    console.error("Error getting all images:", error);
    return [];
  }
}