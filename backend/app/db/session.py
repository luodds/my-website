# app/db/session.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite 数据库文件放在当前目录下
SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

# connect_args 是 SQLite 特有的，其他数据库不需要
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# 这是一个依赖项函数，用于给每个请求分配一个数据库会话
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()