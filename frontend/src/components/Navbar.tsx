"use client"; // 必须是客户端组件，因为要读取 Context

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* 左侧：Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              MyWebsite
            </Link>
            
            {/* 可以在这里加中间的导航链接 */}
            <div className="hidden md:flex ml-10 space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600">首页</Link>
              <Link href="/articles" className="text-gray-700 hover:text-blue-600">文章</Link>
            </div>
          </div>

          {/* 右侧：用户状态区 */}
          <div className="flex items-center space-x-4">
            {user ? (
              // --- 登录后显示 ---
              <>
                <span className="text-sm text-gray-500">
                  你好, <span className="font-semibold text-gray-900">{user.username}</span>
                </span>
                
                <Link 
                  href="/dashboard" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  个人中心
                </Link>

                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                >
                  退出
                </button>
              </>
            ) : (
              // --- 未登录显示 ---
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}