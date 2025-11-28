import Image from "next/image";
import SocialIcon from "./SocialIcon";

type SocialLink = {
  name: string;
  icon: string;
  url: string;
};

type ProfileProps = {
  avatar: string;
  name: string;
  title: string;
  bio: string;
  socialLinks: SocialLink[];
};

export default function Profile({
  avatar,
  name,
  title,
  bio,
  socialLinks,
}: ProfileProps) {
  return (
    <section className="relative flex min-h-[50vh] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-orange-100 via-pink-50 to-yellow-50 px-6 py-12">
      {/* 可爱的装饰元素 */}
      <div className="absolute right-10 top-10 h-20 w-20 rounded-full bg-pink-200/40 blur-2xl"></div>
      <div className="absolute bottom-20 left-10 h-16 w-16 rounded-full bg-orange-200/40 blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 h-12 w-12 rounded-full bg-yellow-200/30 blur-lg"></div>

      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        {/* 头像 - 添加可爱的边框和阴影 */}
        <div className="relative h-28 w-28 overflow-hidden rounded-full bg-gradient-to-br from-pink-300 to-orange-300 p-1 shadow-lg ring-4 ring-white/50">
          <div className="h-full w-full overflow-hidden rounded-full bg-white">
            <Image
              src={avatar}
              alt={name}
              width={112}
              height={112}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>

        {/* 姓名 - 暖色调文字 */}
        <h1 className="text-3xl font-bold text-orange-600 drop-shadow-sm">
          {name}
        </h1>

        {/* 职业 - 可爱的标签样式 */}
        <div className="rounded-full bg-gradient-to-r from-pink-400 to-orange-400 px-6 py-2 shadow-md">
          <p className="text-base font-semibold text-white">{title}</p>
        </div>

        {/* 个人简介 - 柔和的文字颜色 */}
        <p className="max-w-2xl text-base leading-relaxed text-orange-800/80">
          {bio}
        </p>

        {/* 社交媒体链接 - 可爱的按钮样式 */}
        <div className="flex items-center gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-orange-600 shadow-md transition-all hover:scale-110 hover:bg-gradient-to-br hover:from-pink-400 hover:to-orange-400 hover:text-white hover:shadow-lg"
              aria-label={link.name}
            >
              <SocialIcon name={link.name} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

