# app/models/user.py
from sqlalchemy import Boolean, Column, Integer, String, DateTime
from datetime import datetime, timedelta, timezone

from app.db.session import Base  # 稍后我们会创建这个

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)  # 存加密后的乱码
    is_active = Column(Boolean, default=True)
    created_at = Column(
    DateTime(timezone=True),
    default=lambda: datetime.now(timezone(timedelta(hours=8)))
    )