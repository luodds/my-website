"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  // 简单的路由保护：没登录就踢回登录页
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div className="flex justify-center mt-10">加载中...</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">欢迎回来, {user.username}!</h1>
      <div className="bg-white p-6 rounded shadow border">
        <p><strong>邮箱:</strong> {user.email}</p>
        <p><strong>用户ID:</strong> {user.id}</p>
        <p><strong>注册时间:</strong> {new Date(user.created_at).toLocaleString()}</p>
      </div>

      <button
        onClick={logout}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        退出登录
      </button>
    </div>
  );
}