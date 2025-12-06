'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  // 只在开发环境显示后台链接
  const isDevelopment = process.env.NODE_ENV === 'development';
  const pathname = usePathname();

  // 判断链接是否激活
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(path);
  };

  // 获取链接的样式类
  const getLinkClassName = (path: string) => {
    const baseClasses = "rounded-full px-6 py-2 text-sm font-medium transition-all hover:scale-105";
    if (isActive(path)) {
      return `${baseClasses} bg-gradient-to-r from-pink-400 to-orange-400 text-white shadow-md hover:shadow-lg font-semibold`;
    }
    return `${baseClasses} text-orange-600 hover:bg-orange-100 hover:text-orange-700`;
  };

  return (
    <nav className="w-full border-b-2 border-orange-200/50 bg-gradient-to-r from-orange-50 to-pink-50 px-6 py-4 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-8">
        <Link
          href="/"
          className={getLinkClassName('/')}
        >
          主页
        </Link>
        {isDevelopment && (
          <Link
            href="/admin"
            className={getLinkClassName('/admin')}
          >
            管理后台
          </Link>
        )}
        <Link
          href="/products"
          className={getLinkClassName('/products')}
        >
          手账内页清单
        </Link>
        {/* <Link
          href="#"
          className={getLinkClassName('#')}
        >
          待定
        </Link> */}
      </div>
    </nav>
  );
}

