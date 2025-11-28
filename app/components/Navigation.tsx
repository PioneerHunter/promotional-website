import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="w-full border-b border-white/10 bg-[#1A202C] px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-8">
        <Link
          href="/"
          className="rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
        >
          主页
        </Link>
        <Link
          href="#"
          className="text-sm font-medium text-white/70 transition-colors hover:text-white"
        >
          待定
        </Link>
        <Link
          href="#"
          className="text-sm font-medium text-white/70 transition-colors hover:text-white"
        >
          待定
        </Link>
      </div>
    </nav>
  );
}

