from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta, timezone

from app.db.session import Base

# 定义北京时间生成函数 (保持和你 User 模型一致)
def current_time_cn():
    return datetime.now(timezone(timedelta(hours=8)))

class Album(Base):
    __tablename__ = "albums"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False) # 相册名，如"2025春季班"
    description = Column(Text, nullable=True)          # 相册简介
    cover_image = Column(String, nullable=True)        # 相册封面图URL
    
    # 外键关联：关联到 User 表 (即：这个相册是谁创建的)
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    created_at = Column(DateTime(timezone=True), default=current_time_cn)
    updated_at = Column(DateTime(timezone=True), default=current_time_cn, onupdate=current_time_cn)

    # 关系定义
    owner = relationship("User", back_populates="albums") # 反向关联 User
    artworks = relationship("Artwork", back_populates="album", cascade="all, delete-orphan") # 级联删除：删相册，里面的画也删掉


class Artwork(Base):
    __tablename__ = "artworks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=True)  # 作品标题 (可选)
    description = Column(Text, nullable=True)          # 老师点评/描述
    image_url = Column(String, nullable=False)         # 图片存储路径/URL (核心字段)
    
    # 外键关联：关联到 Album 表 (即：这个作品属于哪个相册)
    album_id = Column(Integer, ForeignKey("albums.id"))
    
    created_at = Column(DateTime(timezone=True), default=current_time_cn)

    # 关系定义
    album = relationship("Album", back_populates="artworks")