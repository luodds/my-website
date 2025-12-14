import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. 允许加载本地图片的配置 (保持你之前的配置)
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/static/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/static/uploads/**',
      },
    ],
    // 允许非优化的图片加载 (解决本地IP限制)
    unoptimized: true, 
  },

  // 2. 👇👇👇 核心修改：配置反向代理 👇👇👇
  async rewrites() {
    return [
      {
        // 凡是前端访问 /api/python/开头的请求...
        source: '/api/python/:path*',
        // ...都转发到本地的 8000 端口
        destination: 'http://127.0.0.1:8000/:path*', 
      },
      // 把 /static/uploads 也代理过去，解决图片显示问题
      {
        source: '/static/uploads/:path*',
        destination: 'http://127.0.0.1:8000/static/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;