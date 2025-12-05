import Navigation from "./components/Navigation";
import Profile from "./components/Profile";
import Products from "./components/Products";
import { getProducts } from "./lib/products";
import type { SocialLink } from "./types";

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

export default async function Home() {
  // 从 data/products.json 读取产品数据
  const allProducts = await getProducts();

  // 只显示 showOnHomepage 为 true 的产品（默认值也为 true）
  const products = allProducts.filter(
    (product) => product.showOnHomepage !== false
  );

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
