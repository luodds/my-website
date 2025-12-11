# app/core/config.py
class Settings:
    PROJECT_NAME: str = "My FastAPI Project"
    # ⚠️ 生产环境必须把这个换成复杂的随机字符串！不要泄露！
    SECRET_KEY: str = "super-secret-key-please-change-it"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30  # Token 30分钟过期

settings = Settings()