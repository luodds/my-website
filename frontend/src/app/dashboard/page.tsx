"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // 引入 Link

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div className="flex justify-center mt-10">加载中...</div>;
  }

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">欢迎回来, {user.username} 👋</h1>
          <p className="text-gray-500 mt-2">今天是 {new Date().toLocaleDateString()}，祝你工作愉快。</p>
        </div>
        <button onClick={logout} className="text-red-500 hover:text-red-700 text-sm font-medium">
          退出登录
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 左侧：用户信息卡片 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-lg font-semibold mb-4">我的信息</h2>
          <div className="space-y-3 text-sm">
            <p className="flex justify-between"><span className="text-gray-500">邮箱:</span> <span>{user.email}</span></p>
            <p className="flex justify-between"><span className="text-gray-500">ID:</span> <span>{user.id}</span></p>
            <p className="flex justify-between"><span className="text-gray-500">注册时间:</span> <span>{new Date(user.created_at).toLocaleDateString()}</span></p>
          </div>
        </div>

        {/* 右侧：功能快捷入口 */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-800">常用工具</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* --- 作品集工具入口卡片 --- */}
            <Link href="/dashboard/albums" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer h-full">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🎨
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">教学作品集</h3>
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">已上线</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">
                  管理班级相册，批量上传学生作品，生成展示链接。
                </p>
              </div>
            </Link>

            {/* --- 占位符：未来工具 --- */}
            <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center h-full opacity-60">
              <div className="text-3xl mb-2">🚧</div>
              <h3 className="font-medium text-gray-900">工资计算器</h3>
              <p className="text-xs text-gray-500 mt-1">开发中，敬请期待...</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}