// src/services/api.ts

// 定义返回数据的类型 (TypeScript 的好处)
interface BackendResponse {
  message: string;
  status: string;
  code: number;
}

export const getDataFromPython = async (): Promise<BackendResponse> => {
  // 使用环境变量
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    // 发起请求
    const res = await fetch(`${apiUrl}/api/data`, {
      cache: 'no-store', // 禁用缓存，保证每次刷新都拿最新数据
    });

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    return res.json();
  } catch (error) {
    console.error("Error connecting to backend:", error);
    return { message: "连接后端失败", status: "error", code: 500 };
  }
};