// src/types/portfolio.ts

export interface Artwork {
  id: number;
  title?: string;
  description?: string;
  image_url: string; // 核心：图片的 URL
  album_id: number;
  created_at: string;
}

export interface Album {
  id: number;
  title: string;
  description?: string;
  cover_image?: string;
  owner_id: number;
  created_at: string;
  artworks?: Artwork[]; // 详情页可能会带出作品列表
}

export interface AlbumCreate {
  title: string;
  description?: string;
  cover_image?: string;
}