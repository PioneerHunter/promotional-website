import Image from "next/image";

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
    <section className="flex min-h-screen flex-col items-center justify-center bg-[#1A202C] px-6 py-20">
      <div className="flex flex-col items-center gap-8 text-center">
        {/* 头像 */}
        <div className="relative h-32 w-32 overflow-hidden rounded-full bg-green-400">
          <Image
            src={avatar}
            alt={name}
            width={128}
            height={128}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        {/* 姓名 */}
        <h1 className="text-4xl font-semibold text-white">{name}</h1>

        {/* 职业 */}
        <p className="text-xl text-green-400">{title}</p>

        {/* 个人简介 */}
        <p className="max-w-2xl text-lg leading-relaxed text-white/90">
          {bio}
        </p>

        {/* 社交媒体链接 */}
        <div className="flex items-center gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white transition-opacity hover:opacity-70"
              aria-label={link.name}
            >
              <Image
                src={link.icon}
                alt={link.name}
                width={24}
                height={24}
                className="h-6 w-6"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

