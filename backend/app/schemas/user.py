# app/schemas/user.py
from pydantic import BaseModel, EmailStr
from datetime import datetime

# 1. 基础模型：共享的字段
class UserBase(BaseModel):
    email: EmailStr
    username: str

# 2. 创建时专用（前端传过来包含密码）
class UserCreate(UserBase):
    password: str

# 3. 读取时专用（返回给前端，绝对不能包含密码！）
class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True  # 允许从 ORM 模型直接读取数据