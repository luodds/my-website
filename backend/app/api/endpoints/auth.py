# app/api/endpoints/auth.py
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core import security
from app.core.config import settings
from app.crud import crud_user
from app.schemas.token import Token
from app.db.session import get_db

router = APIRouter()

@router.post("/login/access-token", response_model=Token)
def login_access_token(
    db: Session = Depends(get_db), 
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    OAuth2 兼容的 token 登录接口，获取 access token
    """
    # 1. 验证用户
    # 注意：OAuth2PasswordRequestForm 只有 username 和 password 字段
    # 虽然我们要用 email 登录，但前端还是把 email 填在 username 字段里发过来
    # user = crud_user.authenticate_user(db, username=form_data.username, password=form_data.password)
    user = crud_user.authenticate_user(db, email=form_data.username, password=form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 2. 如果验证通过，生成 Token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    # 3. 返回 Token
    return {
        "access_token": access_token, 
        "token_type": "bearer"
    }