// src/types/user.ts

// 1. 登录成功后后端返回的 Token 结构
export interface TokenResponse {
  access_token: string;
  token_type: string;
}

// 2. 用户个人信息结构 (对应后端的 UserResponse)
export interface UserProfile {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  created_at: string;
}

// 3. 注册时需要的结构
export interface UserRegister {
  email: string;
  username: string;
  password: string;
}