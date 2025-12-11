# app/api/endpoints/users.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserResponse
from app.crud import crud_user
from app.db.session import get_db

router = APIRouter()

@router.post("/", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # 1. 检查邮箱是否已存在
    db_user = crud_user.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # 2. 创建用户
    return crud_user.create_user(db=db, user=user)