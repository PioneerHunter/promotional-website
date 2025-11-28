import Image from "next/image";
import type { Product } from "../types";

type ProductCardProps = {
  product: Product;
  onImageClick: (image: string, alt: string) => void;
};

export default function ProductCard({ product, onImageClick }: ProductCardProps) {
  return (
    <article className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:scale-[1.02] hover:shadow-xl">
      {/* 图片 */}
      <div
        className="relative h-64 w-full overflow-hidden rounded-t-2xl"
        onClick={() => onImageClick(product.image, product.title)}
      >
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {/* 图片上的文字叠加 - 可爱风格 */}
        <div className="absolute bottom-4 left-4">
          <span className="rounded-full bg-gradient-to-r from-pink-400/90 to-orange-400/90 px-4 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-sm">
            {product.brand || "PRODUCT"}
          </span>
        </div>
      </div>

      {/* 内容 */}
      <div className="p-6">
        <h2 className="mb-2 text-xl font-bold text-orange-700">
          {product.title}
        </h2>
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-orange-600/80">
          {product.description}
        </p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-orange-500">{product.date}</span>
          <div className="flex gap-2">
            {product.categories.map((category, index) => (
              <span
                key={index}
                className="rounded-full bg-gradient-to-r from-pink-100 to-orange-100 px-3 py-1 font-medium text-orange-600"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

