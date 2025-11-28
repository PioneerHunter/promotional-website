export type Product = {
  id: string;
  image: string;
  title: string;
  description: string;
  date: string;
  categories: string[];
  brand?: string;
};

export type SocialLink = {
  name: string;
  icon: string;
  url: string;
};

