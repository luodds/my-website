import { TokenResponse, UserProfile, UserRegister } from "@/types/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authService = {
  // 1. 注册
  register: async (data: UserRegister) => {
    const res = await fetch(`${API_URL}/users/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("注册失败");
    return res.json();
  },

  // 2. 登录 (注意这里的数据处理！)
  login: async (email: string, password: string): Promise<TokenResponse> => {
    // FastAPI 的 OAuth2 依赖要求表单数据，且字段名必须叫 username 和 password
    const formData = new URLSearchParams();
    formData.append("username", email); // 哪怕是邮箱，字段名也得叫 username
    formData.append("password", password);

    const res = await fetch(`${API_URL}/auth/login/access-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!res.ok) throw new Error("账号或密码错误");
    return res.json();
  },

  // 3. 获取个人信息 (需要携带 Token)
  getMe: async (token: string): Promise<UserProfile> => {
    const res = await fetch(`${API_URL}/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // 携带 Token 的标准格式
      },
    });

    if (!res.ok) throw new Error("获取用户信息失败");
    return res.json();
  },
};