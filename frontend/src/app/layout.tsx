import { AuthProvider } from "@/context/AuthContext"; // 引入
import "@/styles/globals.css"; // 之前改过的样式路径

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* 包裹住整个应用 */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}