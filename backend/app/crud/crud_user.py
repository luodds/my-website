# app/crud/crud_user.py
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash
from app.core.security import verify_password  # 记得引入 verify_password

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate):
    # 1. 密码加密
    hashed_password = get_password_hash(user.password)
    # 2. 创建 DB 模型实例
    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password
    )
    # 3. 入库
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- 新增认证函数 ---
def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username=username)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user