import { redirect } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 生产环境重定向到首页
  if (process.env.NODE_ENV === 'production') {
    redirect('/');
  }

  return <>{children}</>;
}

