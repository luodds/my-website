"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { portfolioService } from "@/services/portfolio";

export default function CreateAlbumPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await portfolioService.createAlbum(token, { title, description });
      router.push("/dashboard/albums"); // 创建成功跳回列表
    } catch (error) {
      alert("创建失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">新建作品集</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm font-medium mb-1">相册名称</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="例如：2025春季素描一班"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">简介</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2 h-32"
            placeholder="写点什么..."
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSubmitting ? "创建中..." : "创建相册"}
        </button>
      </form>
    </div>
  );
}