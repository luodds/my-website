"use client"; // 这是一个客户端组件

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserProfile } from "@/types/user";
import { authService } from "@/services/auth";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 初始化：检查本地是否有 Token
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const profile = await authService.getMe(token);
          setUser(profile);
        } catch (error) {
          console.error("Token 失效", error);
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  // 登录动作
  const login = async (token: string) => {
    localStorage.setItem("token", token); // 1. 存 Token
    const profile = await authService.getMe(token); // 2. 拿用户信息
    setUser(profile); // 3. 更新状态
    router.push("/dashboard"); // 4. 跳转
  };

  // 登出动作
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 这是一个自定义 Hook，方便其他组件调用
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};