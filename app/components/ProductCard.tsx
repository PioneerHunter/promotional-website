import Image from "next/image";
import type { Product } from "../types";

type ProductCardProps = {
  product: Product;
  onImageClick: (image: string, alt: string) => void;
};

export default function ProductCard({ product, onImageClick }: ProductCardProps) {
  return (
    <article className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-lg">
      {/* 图片 */}
      <div
        className="relative h-64 w-full overflow-hidden"
        onClick={() => onImageClick(product.image, product.title)}
      >
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* 图片上的文字叠加 */}
        <div className="absolute bottom-4 left-4">
          <span className="rounded bg-black/50 px-3 py-1 text-sm font-bold text-white">
            {product.brand || "PRODUCT"}
          </span>
        </div>
      </div>

      {/* 内容 */}
      <div className="p-6">
        <h2 className="mb-2 text-xl font-semibold text-gray-900">
          {product.title}
        </h2>
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600">
          {product.description}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{product.date}</span>
          <div className="flex gap-2">
            {product.categories.map((category, index) => (
              <span
                key={index}
                className="rounded-full bg-gray-100 px-2 py-1"
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

