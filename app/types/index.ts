export type Product = {
  id: string;
  image: string;
  title: string;
  description: string;
  date: string;
  categories: string[];
  brand?: string;
  showOnHomepage?: boolean; // 是否展示在主页
};

export type SocialLink = {
  name: string;
  icon: string;
  url: string;
};

