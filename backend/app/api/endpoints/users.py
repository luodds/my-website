# app/api/endpoints/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserResponse
from app.crud import crud_user
from app.db.session import get_db

from app.models.user import User # 导入 User 模型类型提示
from app.api import deps         # 导入刚才写的依赖

router = APIRouter()

@router.post("/", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # 1. 检查用户名是否已存在
    db_user = crud_user.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )

    # 2. 检查邮箱是否已存在
    db_user = crud_user.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # 3. 创建用户
    return crud_user.create_user(db=db, user=user)

# --- 新增：获取当前用户信息 ---
@router.get("/me", response_model=UserResponse)
def read_user_me(
    current_user: User = Depends(deps.get_current_user)
):
    """
    获取当前登录用户的详细信息
    (这个接口被 deps.get_current_user 保护了，没 Token 进不来)
    """
    # 这里的 current_user 已经是数据库里查出来的那个 User 对象了
    return current_user