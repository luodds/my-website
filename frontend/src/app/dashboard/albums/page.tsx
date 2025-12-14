"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { portfolioService } from "@/services/portfolio";
import { Album } from "@/types/portfolio";

export default function AlbumsPage() {
  const { user } = useAuth();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const data = await portfolioService.getMyAlbums(token);
          setAlbums(data);
        } catch (error) {
          console.error(error);
        }
      }
      setIsLoading(false);
    };
    fetchAlbums();
  }, []);

  // 新增删除处理函数
  const handleDelete = async (e: React.MouseEvent, albumId: number) => {
    e.preventDefault(); // 阻止 Link 跳转
    if (!confirm("确定要删除这个相册吗？里面的所有作品也会被删除！")) return;

    const token = localStorage.getItem("token");
    if (token) {
      try {
        await portfolioService.deleteAlbum(token, albumId);
        // 从本地状态移除，避免重新请求后端
        setAlbums((prev) => prev.filter((a) => a.id !== albumId));
      } catch (error) {
        alert("删除失败");
      }
    }
  };

  if (isLoading) return <div>加载中...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">我的教学作品集 🎨</h1>
        <Link
          href="/dashboard/albums/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + 新建相册
        </Link>
      </div>

      {albums.length === 0 ? (
        <div className="text-gray-500 text-center py-20 bg-gray-50 rounded-lg">
          还没有相册，快去创建一个吧！
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <Link key={album.id} href={`/dashboard/albums/${album.id}`}>
              <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white cursor-pointer group">
                
                {/* --- 新增：删除按钮 (绝对定位在右上角) --- */}
                <button
                  onClick={(e) => handleDelete(e, album.id)}
                  className="absolute top-2 right-2 z-10 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                  title="删除相册"
                >
                  🗑️
                </button>
                {/* ------------------------------------- */}

                <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                   <span className="text-4xl">📁</span>
                </div>
                {/* ... */}
                
                
                {/* 封面图区域 */}
                <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                   {/* 这里为了MVP简单，没有封面就显示灰底 */}
                   <span className="text-4xl">📁</span>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg group-hover:text-blue-600">{album.title}</h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                    {album.description || "暂无描述"}
                  </p>
                  <div className="mt-3 text-xs text-gray-400">
                    创建于 {new Date(album.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
      )}
    </div>
  );
}