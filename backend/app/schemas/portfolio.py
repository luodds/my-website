from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# --- 1. Artwork (作品) 的规则 ---

class ArtworkBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: str

class ArtworkCreate(ArtworkBase):
    pass # 创建时只需要 Base 里的字段

class ArtworkResponse(ArtworkBase):
    id: int
    album_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- 2. Album (相册) 的规则 ---

class AlbumBase(BaseModel):
    title: str
    description: Optional[str] = None
    cover_image: Optional[str] = None

class AlbumCreate(AlbumBase):
    pass # 创建相册时，前端传 title, description 等

class AlbumResponse(AlbumBase):
    id: int
    owner_id: int
    created_at: datetime
    # 这一行很关键：返回相册详情时，是否要顺带把里面的作品列表也吐出来？
    # 暂时设为 Optional，列表页不需要，详情页可能需要
    artworks: List[ArtworkResponse] = [] 

    class Config:
        from_attributes = True