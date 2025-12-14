from sqlalchemy.orm import Session
from app.models.portfolio import Album, Artwork
from app.schemas.portfolio import AlbumCreate, ArtworkCreate

# --- 相册 (Album) 相关操作 ---

def create_user_album(db: Session, album: AlbumCreate, user_id: int):
    """创建一个属于特定用户的相册"""
    db_album = Album(
        title=album.title,
        description=album.description,
        cover_image=album.cover_image,
        owner_id=user_id # 绑定当前登录用户
    )
    db.add(db_album)
    db.commit()
    db.refresh(db_album)
    return db_album

def get_user_albums(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    """获取某个用户的所有相册"""
    return db.query(Album).filter(Album.owner_id == user_id)\
            .offset(skip).limit(limit).all()

def get_album_by_id(db: Session, album_id: int):
    """根据ID获取相册详情"""
    return db.query(Album).filter(Album.id == album_id).first()

# --- 作品 (Artwork) 相关操作 ---

def create_artwork(db: Session, artwork: ArtworkCreate, album_id: int):
    """在指定相册下添加作品"""
    db_artwork = Artwork(
        title=artwork.title,
        description=artwork.description,
        image_url=artwork.image_url,
        album_id=album_id
    )
    db.add(db_artwork)
    db.commit()
    db.refresh(db_artwork)
    return db_artwork

def get_artworks_by_album(db: Session, album_id: int, skip: int = 0, limit: int = 100):
    """获取某个相册下的所有作品"""
    return db.query(Artwork).filter(Artwork.album_id == album_id)\
            .offset(skip).limit(limit).all()

def delete_album(db: Session, album_id: int):
    """删除相册（SQLAlchemy 级联配置会自动删除关联的作品记录）"""
    db_album = db.query(Album).filter(Album.id == album_id).first()
    if db_album:
        db.delete(db_album)
        db.commit()
        return True
    return False

def delete_artwork(db: Session, artwork_id: int):
    """删除单个作品"""
    db_artwork = db.query(Artwork).filter(Artwork.id == artwork_id).first()
    if db_artwork:
        db.delete(db_artwork)
        db.commit()
        return True
    return False

# 辅助函数：查询作品（用于权限检查）
def get_artwork_by_id(db: Session, artwork_id: int):
    return db.query(Artwork).filter(Artwork.id == artwork_id).first()