import { Album, AlbumCreate, Artwork } from "@/types/portfolio";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export const portfolioService = {
  // 1. 获取我的相册列表
  getMyAlbums: async (token: string): Promise<Album[]> => {
    const res = await fetch(`${API_URL}/portfolio/albums`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("获取相册失败");
    return res.json();
  },

  // 2. 创建新相册
  createAlbum: async (token: string, data: AlbumCreate): Promise<Album> => {
    const res = await fetch(`${API_URL}/portfolio/albums`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("创建相册失败");
    return res.json();
  },

  // 3. 获取相册详情（包含里面的作品）
  getAlbumDetail: async (token: string, albumId: number): Promise<Album> => {
    // 这里我们分两步：先拿相册信息，再拿作品列表（或者后端做了聚合）
    // 为了简单，我们复用后端的逻辑，分别获取再前端组合，或者直接依赖后端的 relationships
    // 这里假设后端 /albums/{id} 暂时只返回相册基本信息，我们再调一个接口拿作品
    
    // A. 拿相册信息
    const resAlbum = await fetch(`${API_URL}/portfolio/albums/${albumId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!resAlbum.ok) throw new Error("获取相册详情失败");
    const album = await resAlbum.json();

    // B. 拿该相册下的作品
    const resArtworks = await fetch(`${API_URL}/portfolio/albums/${albumId}/artworks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (resArtworks.ok) {
      album.artworks = await resArtworks.json();
    }
    
    return album;
  },

  // 4. 上传图片 (核心功能)
  uploadImage: async (token: string, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file); // 'file' 必须对应后端 UploadFile 的参数名

    const res = await fetch(`${API_URL}/portfolio/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }, // 不写 Content-Type，浏览器会自动设置 multipart/form-data
      body: formData,
    });
    
    if (!res.ok) throw new Error("图片上传失败");
    const data = await res.json();
    return data.url; // 返回图片的 URL
  },

  // 5. 创建作品记录 (图片上传完后，把 URL 存到数据库)
  createArtwork: async (token: string, albumId: number, data: { image_url: string; title?: string }) => {
    const res = await fetch(`${API_URL}/portfolio/albums/${albumId}/artworks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("保存作品失败");
    return res.json();
  },

  // 6. 删除相册
  deleteAlbum: async (token: string, albumId: number) => {
    const res = await fetch(`${API_URL}/portfolio/albums/${albumId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("删除相册失败");
  },

  // 7. 删除作品
  deleteArtwork: async (token: string, artworkId: number) => {
    const res = await fetch(`${API_URL}/portfolio/artworks/${artworkId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("删除作品失败");
  },

};