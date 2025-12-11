from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # 1. 导入 CORS 中间件

app = FastAPI()

# 2. 配置允许的来源列表
origins = [
    "http://localhost:3000",    # Next.js 默认地址
    "http://127.0.0.1:3000",
]

# 3. 添加中间件 (这就是“放行条”)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # 允许谁访问
    allow_credentials=True,
    allow_methods=["*"],        # 允许什么方法 (GET, POST等)
    allow_headers=["*"],        # 允许什么 Header
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

# 4. 新增一个专门给前端测试的接口
@app.get("/api/data")
def get_data():
    return {
        "message": "这是来自 Python 后端的数据！🐍", 
        "status": "success",
        "code": 200
    }