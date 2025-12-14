"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  
  // 状态管理
  const [isToolsOpen, setIsToolsOpen] = useState(false);       // 桌面端工具箱下拉
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 手机端汉堡菜单
  
  // 桌面端：点击外部关闭工具箱
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 手机端：切换路由后自动关闭菜单
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* --- 左侧 Logo 和 汉堡按钮 --- */}
          <div className="flex items-center w-full md:w-auto">
            
            {/* 1. 手机端汉堡按钮 (只在 md 以下显示) */}
            <div className="flex items-center md:hidden mr-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-blue-600 focus:outline-none p-2"
              >
                {/* 汉堡图标 / 关闭图标 */}
                {isMobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-blue-600 flex-shrink-0">
              MyWebsite
            </Link>
            
            {/* --- 2. 桌面端导航 (手机端隐藏 hidden) --- */}
            <div className="hidden md:flex ml-10 space-x-8 items-center">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">首页</Link>
              <Link href="/articles" className="text-gray-700 hover:text-blue-600 font-medium">文章</Link>

              {/* 桌面端工具箱下拉 */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsToolsOpen(!isToolsOpen)}
                  className={`flex items-center font-medium transition-colors ${
                    isToolsOpen ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  🛠️ 工具箱
                  <svg className={`w-4 h-4 ml-1 transition-transform ${isToolsOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isToolsOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">教学工具</div>
                    <Link href="/dashboard/albums" onClick={() => setIsToolsOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                      🎨 美术教学作品集
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* --- 右侧：用户状态 (手机端保持显示，根据你的截图) --- */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {user ? (
              <>
                {/* 手机端隐藏“你好xxx”，只显示头像或简化版 */}
                <span className="text-sm text-gray-500 hidden md:inline-block">
                  你好, <span className="font-semibold text-gray-900">{user.username}</span>
                </span>
                
                {/* 个人中心链接 (手机端可能需要简化文案) */}
                <Link 
                  href="/dashboard" 
                  className="px-2 md:px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                >
                  <span className="md:hidden">我</span>
                  <span className="hidden md:inline">个人中心</span>
                </Link>

                <button
                  onClick={logout}
                  className="px-3 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors whitespace-nowrap"
                >
                  退出
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600">登录</Link>
                <Link href="/register" className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">注册</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- 3. 手机端展开菜单 (核心修改部分) --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/" 
              onClick={closeMobileMenu}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              首页
            </Link>
            <Link 
              href="/articles" 
              onClick={closeMobileMenu}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              文章
            </Link>
            
            {/* 手机端工具箱分组 */}
            <div className="border-t border-gray-100 mt-2 pt-2">
              <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase">工具箱</div>
              <Link 
                href="/dashboard/albums" 
                onClick={closeMobileMenu}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 ml-2 border-l-2 border-transparent hover:border-blue-500"
              >
                 ↳ 🎨 美术教学作品集
              </Link>
              {/* 未来可以在这里加更多工具 */}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}