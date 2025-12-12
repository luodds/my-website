# app/api/deps.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.core.config import settings
from app.db.session import get_db
from app.models.user import User
from app.crud.crud_user import get_user_by_email

# 1. 定义 OAuth2 模式
# tokenUrl 指向我们之前写的登录接口，这样 Swagger UI 会知道去哪里拿 Token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login/access-token")

# 2. 核心依赖函数：获取当前用户
async def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # A. 解析 Token
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM]
        )
        username: str = payload.get("sub") # 这里的 sub 是我们存进去的 email
        if username is None:
            raise credentials_exception
            
    except JWTError:
        raise credentials_exception
    
    # B. 去数据库查用户
    # 注意：这里我们直接复用了 crud 层的函数，体现了解耦的好处
    user = get_user_by_email(db, email=username)
    
    if user is None:
        raise credentials_exception
        
    return user