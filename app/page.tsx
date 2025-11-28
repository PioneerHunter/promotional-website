import Navigation from "./components/Navigation";
import Profile from "./components/Profile";
import Products from "./components/Products";
import type { Product, SocialLink } from "./types";

// 示例数据 - 实际使用时可以从 API 或 CMS 获取
const profileData = {
  avatar: "/avatar.jpg", // 需要添加头像图片，或使用占位图片: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop"
  name: "Michael Caine",
  title: "Front-end developer",
  bio: "A Full Stack Front-end Developer based in New York. Meticulous web developer with over 2 years of front end experience and passion for responsive and mobile-first website design.",
  socialLinks: [
    {
      name: "Facebook",
      icon: "/social/facebook.svg",
      url: "https://facebook.com",
    },
    {
      name: "Twitter",
      icon: "/social/twitter.svg",
      url: "https://twitter.com",
    },
    {
      name: "Github",
      icon: "/social/github.svg",
      url: "https://github.com",
    },
    {
      name: "YouTube",
      icon: "/social/youtube.svg",
      url: "https://youtube.com",
    },
    {
      name: "LinkedIn",
      icon: "/social/linkedin.svg",
      url: "https://linkedin.com",
    },
  ] as SocialLink[],
};

const products: Product[] = [
  {
    id: "1",
    image: "/products/product1.jpg", // 需要添加图片，或使用占位图片: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=800&fit=crop"
    title: "当冬天来临时",
    description:
      "欢迎来到THP,在这里我们一起庆祝室内园艺的奇妙世界，探索植物养护的每一个细节...",
    date: "7月 26, 2023",
    categories: ["基本护理", "博客"],
    brand: "THE HOUSEPLANTS PODCAST",
  },
  {
    id: "2",
    image: "/products/product2.jpg", // 需要添加图片，或使用占位图片: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=800&fit=crop"
    title: "芳香花园的艺术",
    description:
      "欢迎来到一期深情款款的THP节目————失去后的疗愈与重新发现，让我们一起探索...",
    date: "7月 26, 2023",
    categories: ["历史", "博客"],
    brand: "THE HOUSEPLANTS PODCAST",
  },
  {
    id: "3",
    image: "/products/product3.jpg", // 需要添加图片，或使用占位图片: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1200&h=800&fit=crop"
    title: "更大的花盆能养出更好的植物",
    description:
      "欢迎来到THP,您终极的室内园艺资源!在这一集中，我们将深入探讨花盆大小对植物生长的影响...",
    date: "7月 26, 2023",
    categories: ["基本护理", "花", "博客"],
    brand: "THE HOUSEPLANTS PODCAST",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Profile
        avatar={profileData.avatar}
        name={profileData.name}
        title={profileData.title}
        bio={profileData.bio}
        socialLinks={profileData.socialLinks}
      />
      <Products products={products} />
    </div>
  );
}
