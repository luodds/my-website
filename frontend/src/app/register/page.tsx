"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import Link from "next/link"; // 用于跳转回登录页

export default function RegisterPage() {
  const router = useRouter();
  
  // 使用一个对象来管理表单状态，比写三个 useState 更整洁
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // 通用的输入框处理函数
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      // 1. 调用注册接口
      await authService.register(formData);
      
      // 2. 注册成功反馈
      setSuccess(true);
      
      // 3. 延迟 2 秒后跳转去登录页
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      
    } catch (err: unknown) {
      if (err instanceof Error){
        setError(err.message);
      }else{
        setError("注册失败，请稍后重试");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">
          创建新账户
        </h2>

        {/* 错误提示 */}
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded border border-red-200">
            {error}
          </div>
        )}

        {/* 成功提示 */}
        {success && (
          <div className="p-3 text-sm text-green-500 bg-green-50 rounded border border-green-200">
            🎉 注册成功！即将跳转到登录页面...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 邮箱字段 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">邮箱</label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* 用户名字段 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">用户名</label>
            <input
              name="username"
              type="text"
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="你的昵称"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          {/* 密码字段 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">密码</label>
            <input
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={success} // 成功后禁用按钮防止重复提交
            className={`w-full py-3 text-white font-semibold rounded-lg transition-colors ${
              success 
                ? "bg-green-500 cursor-default" 
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {success ? "注册成功" : "立即注册"}
          </button>
        </form>

        {/* 底部导航链接 */}
        <p className="text-center text-sm text-gray-600">
          已经有账号了？{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            直接登录
          </Link>
        </p>
      </div>
    </div>
  );
}