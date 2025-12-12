import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar"; // 1. 引入组件
import "@/styles/globals.css"; // 确保你的样式路径是对的

// ... metadata 保持不变 ...

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <AuthProvider>
          {/* 2. 放在 Provider 内部，Children 之前 */}
          <Navbar />
          
          {/* 页面主要内容区域 */}
          <main>
            {children}
          </main>
          
        </AuthProvider>
      </body>
    </html>
  );
}