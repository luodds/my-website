import { getDataFromPython } from "@/services/api"; // 引入我们刚才写的函数

// 1. 注意：组件必须是 async 的
export default async function Home() {
  
  // 2. 直接调用函数获取数据
  const data = await getDataFromPython();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">
        前后端联通测试
      </h1>

      <div className="p-6 border rounded-xl shadow-lg bg-gray-50 dark:bg-gray-800">
        <p className="text-lg">
          后端返回的消息：
        </p>
        
        {/* 3. 展示数据 */}
        <p className="text-2xl font-bold text-blue-600 mt-2">
          {data.message}
        </p>
        
        <div className="mt-4 text-sm text-gray-500">
          状态: {data.status} | Code: {data.code}
        </div>
      </div>
    </main>
  );
}