"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import { portfolioService } from "@/services/portfolio";
import { Album } from "@/types/portfolio";

// 👇 1. 新增：URL 修复辅助函数
// 作用：将绝对路径 (localhost) 转换为相对路径，让 Next.js 代理处理，从而支持外网/手机访问
const getCorrectImageUrl = (url: string) => {
  if (!url) return "";
  // 移除数据库中可能存储的本地后端地址
  return url.replace("http://localhost:8000", "").replace("http://127.0.0.1:8000", "");
};

export default function AlbumDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [album, setAlbum] = useState<Album | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 上传状态管理
  const [uploadStatus, setUploadStatus] = useState(""); 
  const [isUploading, setIsUploading] = useState(false);

  const fetchDetail = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const data = await portfolioService.getAlbumDetail(token, parseInt(id));
      setAlbum(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  // --- 批量上传逻辑 ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const files = Array.from(e.target.files); 
    const token = localStorage.getItem("token");
    if (!token) return;

    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadStatus(`正在上传第 ${i + 1} / ${files.length} 张: ${file.name}`);
      
      try {
        // 1. 上传图片 (后端可能返回 http://localhost:8000/static/...)
        const imageUrl = await portfolioService.uploadImage(token, file);
        
        // 2. 创建记录
        await portfolioService.createArtwork(token, parseInt(id), {
          image_url: imageUrl,
          title: file.name.split('.')[0] 
        });
        successCount++;
      } catch (error) {
        console.error(`上传 ${file.name} 失败`, error);
      }
    }

    setUploadStatus(`完成！成功上传 ${successCount} 张`);
    setTimeout(() => setUploadStatus(""), 3000); 
    setIsUploading(false);
    e.target.value = ""; 
    
    fetchDetail();
  };

  // --- 删除作品逻辑 ---
  const handleDeleteArtwork = async (artworkId: number) => {
    if (!confirm("确定删除这张作品吗？")) return;
    
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await portfolioService.deleteArtwork(token, artworkId);
      setAlbum(prev => {
        if (!prev) return null;
        return {
          ...prev,
          artworks: prev.artworks?.filter(art => art.id !== artworkId)
        };
      });
    } catch (error) {
      alert("删除失败");
    }
  };

  if (isLoading) return <div>加载中...</div>;
  if (!album) return <div>相册不存在</div>;

  return (
    <div className="p-8">
      {/* 头部信息 */}
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold">{album.title}</h1>
        <p className="text-gray-500 mt-2">{album.description}</p>
        
        {/* 上传按钮区域 */}
        <div className="mt-4 flex items-center gap-4">
          <label className={`inline-block px-4 py-2 rounded cursor-pointer transition ${
            isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          } text-white shadow`}>
            {isUploading ? "上传中..." : "📷 批量上传图片"}
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              className="hidden" 
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
          
          {uploadStatus && <span className="text-blue-600 font-medium animate-pulse">{uploadStatus}</span>}
        </div>
      </div>

      {/* 图片网格 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {album.artworks?.map((art) => (
          <div key={art.id} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition">
            
            {/* 删除按钮 */}
            <button
              onClick={() => handleDeleteArtwork(art.id)}
              className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
              title="删除图片"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>

            {/* 图片组件 */}
            <Image 
              src={getCorrectImageUrl(art.image_url)} // 👈 2. 使用修复函数
              alt={art.title || "artwork"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized={true} // 保持 true，这在使用代理时很重要
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity truncate">
              {art.title}
            </div>
          </div>
        ))}
      </div>
      
      {album.artworks?.length === 0 && !isUploading && (
        <div className="text-center text-gray-400 py-10">
          暂无作品，试着批量上传几张图片吧！
        </div>
      )}
    </div>
  );
}