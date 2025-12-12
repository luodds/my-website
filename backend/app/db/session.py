# app/db/session.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# PostgreSQL 连接字符串：
# postgresql+psycopg2://用户名:密码@主机:端口/数据库名
SQLALCHEMY_DATABASE_URL = "postgresql+psycopg2://postgres:123456@localhost:5432/my-website-db"

# 创建 PostgreSQL 的 Engine（注意：不再需要 SQLite 的 connect_args）
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=False,        # 调试时可以改成 True 看 SQL
    future=True,       # 可选，使用 SQLAlchemy 2.0 风格
)

# SessionLocal 保持不变
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# Base 也一样
Base = declarative_base()

# FastAPI 依赖项
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
