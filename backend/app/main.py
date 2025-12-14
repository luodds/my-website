import os # 👈 记得导入 os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles # 👈 1. 导入 StaticFiles

from app.db.session import engine, Base
from app.api.endpoints import users, auth, portfolio # 👈 2. 导入 portfolio 模块
from app.models import portfolio as portfolio_model

app = FastAPI()

# 2. 配置允许的来源列表
origins = [
    "http://localhost:3000",    # Next.js 默认地址
    "http://127.0.0.1:3000",
]

# 3. 挂载静态文件目录
# 确保 backend/static 目录存在，如果不存在则创建
if not os.path.exists("static"):
    os.makedirs("static")

# 这里的逻辑是：当访问 http://localhost:8000/static/xxx 时
# FastAPI 会去项目根目录下的 static 文件夹找对应的文件
app.mount("/static", StaticFiles(directory="static"), name="static")

# 3. 添加中间件 (这就是“放行条”)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # 允许谁访问
    allow_credentials=True,
    allow_methods=["*"],        # 允许什么方法 (GET, POST等)
    allow_headers=["*"],        # 允许什么 Header
)

# 自动创建数据库表（生产环境通常用 Alembic 迁移工具，这里为了简单直接创建）
Base.metadata.create_all(bind=engine)



# 包含用户模块的路由
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(portfolio.router, prefix="/portfolio", tags=["portfolio"])


@app.get("/")
def root():
    return {"message": "System is running"}

# 4. 新增一个专门给前端测试的接口
@app.get("/api/data")
def get_data():
    return {
        "message": "这是来自 Python 后端的数据！🐍", 
        "status": "success",
        "code": 200
    }