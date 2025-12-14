import os
import shutil
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api import deps
from app.models.user import User
from app.schemas.portfolio import AlbumCreate, AlbumResponse, ArtworkCreate, ArtworkResponse
from app.crud import crud_portfolio

router = APIRouter()

# --- 1. 图片上传接口 ---
# 这是一个通用的上传接口，前端先传图片，拿到 URL，再填入表单提交
UPLOAD_DIR = "static/uploads" # 图片存放的物理路径

@router.post("/upload", summary="上传图片文件")
async def upload_image(file: UploadFile = File(...)):
    # 1. 确保目录存在
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)
    
    # 2. 生成唯一文件名 (防止同名覆盖)
    # file.filename = "cat.jpg" -> unique_name = "uuid-cat.jpg"
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # 3. 保存文件到磁盘
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # 4. 返回可访问的 URL (假设后端跑在 localhost:8000)
    # 注意：这里返回相对路径，前端拼接 base_url，或者直接返回完整路径
    # 🟢 修改为新代码 (只返回相对路径):
    return {"url": f"/static/uploads/{unique_filename}"}


# --- 2. 相册接口 ---

@router.post("/albums", response_model=AlbumResponse, summary="创建新相册")
def create_album(
    album: AlbumCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    return crud_portfolio.create_user_album(db=db, album=album, user_id=current_user.id)

@router.get("/albums", response_model=List[AlbumResponse], summary="获取我的相册列表")
def read_my_albums(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    return crud_portfolio.get_user_albums(db, user_id=current_user.id, skip=skip, limit=limit)

@router.get("/albums/{album_id}", response_model=AlbumResponse, summary="获取相册详情")
def read_album(
    album_id: int,
    db: Session = Depends(get_db),
    # 暂时允许任何人查看相册，如果要私有化，这里需要加权限校验
):
    album = crud_portfolio.get_album_by_id(db, album_id=album_id)
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    return album


# --- 3. 作品接口 ---

@router.post("/albums/{album_id}/artworks", response_model=ArtworkResponse, summary="向相册添加作品")
def create_artwork_for_album(
    album_id: int,
    artwork: ArtworkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    # 1. 先检查相册是否存在，且是否属于当前用户
    album = crud_portfolio.get_album_by_id(db, album_id=album_id)
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    if album.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this album")
    
    # 2. 创建作品
    return crud_portfolio.create_artwork(db=db, artwork=artwork, album_id=album_id)

@router.get("/albums/{album_id}/artworks", response_model=List[ArtworkResponse], summary="获取相册下的作品")
def read_artworks(
    album_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return crud_portfolio.get_artworks_by_album(db, album_id=album_id, skip=skip, limit=limit)


@router.delete("/albums/{album_id}", status_code=204, summary="删除相册")
def delete_album(
    album_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    album = crud_portfolio.get_album_by_id(db, album_id=album_id)
    if not album:
        raise HTTPException(status_code=404, detail="相册不存在")
    if album.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权删除此相册")
    
    crud_portfolio.delete_album(db, album_id)
    return None # 204 No Content 不需要返回 body

@router.delete("/artworks/{artwork_id}", status_code=204, summary="删除作品")
def delete_artwork(
    artwork_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    artwork = crud_portfolio.get_artwork_by_id(db, artwork_id=artwork_id)
    if not artwork:
        raise HTTPException(status_code=404, detail="作品不存在")
    
    # 检查权限：通过作品找到相册，再看相册主人是不是当前用户
    if artwork.album.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权删除此作品")
        
    crud_portfolio.delete_artwork(db, artwork_id)
    return None