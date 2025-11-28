import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="w-full border-b-2 border-orange-200/50 bg-gradient-to-r from-orange-50 to-pink-50 px-6 py-4 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-8">
        <Link
          href="/"
          className="rounded-full bg-gradient-to-r from-pink-400 to-orange-400 px-6 py-2 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
        >
          主页
        </Link>
        <Link
          href="#"
          className="rounded-full px-6 py-2 text-sm font-medium text-orange-600 transition-all hover:bg-orange-100 hover:text-orange-700"
        >
          待定
        </Link>
        <Link
          href="#"
          className="rounded-full px-6 py-2 text-sm font-medium text-orange-600 transition-all hover:bg-orange-100 hover:text-orange-700"
        >
          待定
        </Link>
      </div>
    </nav>
  );
}

