"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import ImageModal from "./ImageModal";
import type { Product } from "../types";

type ProductsProps = {
  products: Product[];
  showSearch?: boolean; // 是否显示搜索功能，默认为 true
};

export default function Products({ products, showSearch = true }: ProductsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedAlt, setSelectedAlt] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [hasSearched, setHasSearched] = useState(false); // 标记是否已执行搜索

  // 当 products 变化时，如果没有搜索查询，更新过滤后的产品列表
  useEffect(() => {
    if (showSearch && !searchQuery.trim() && !hasSearched) {
      setFilteredProducts(products);
    } else if (!showSearch) {
      setFilteredProducts(products);
    }
  }, [products, searchQuery, hasSearched, showSearch]);

  const handleImageClick = (image: string, alt: string) => {
    setSelectedImage(image);
    setSelectedAlt(alt);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setSelectedAlt("");
  };

  // 执行搜索
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    const query = searchQuery.toLowerCase().trim();
    const filtered = products.filter((product) => {
      // 匹配标题
      const matchTitle = product.title.toLowerCase().includes(query);

      // 匹配描述
      const matchDescription = product.description.toLowerCase().includes(query);

      // 匹配分类
      const matchCategory = product.categories.some((category) =>
        category.toLowerCase().includes(query)
      );

      return matchTitle || matchDescription || matchCategory;
    });

    setFilteredProducts(filtered);
  };

  // 处理回车键搜索
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 处理搜索图标点击
  const handleSearchClick = () => {
    handleSearch();
  };

  // 处理输入框变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // 如果输入框为空，自动显示所有产品并重置搜索状态
    if (!e.target.value.trim()) {
      setFilteredProducts(products);
      setHasSearched(false);
    }
  };

  return (
    <>
      <section className="bg-gradient-to-b from-yellow-50 via-orange-50 to-pink-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          {/* 搜索框 - 只在 showSearch 为 true 时显示 */}
          {showSearch && (
            <>
              <div className="mb-8 flex items-center justify-center">
                <div className="relative w-full max-w-md">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="搜索手账内页（标题、描述、分类）"
                    className="w-full rounded-full border-2 border-orange-200 bg-white px-6 py-3 pr-12 text-sm text-orange-800 placeholder:text-orange-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                  <button
                    onClick={handleSearchClick}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-orange-500 transition-colors hover:bg-orange-100 hover:text-orange-600"
                    aria-label="搜索"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 搜索结果提示 - 只有执行搜索后才显示 */}
              {hasSearched && searchQuery && (
                <div className="mb-6 text-center text-sm text-orange-600">
                  找到 {filteredProducts.length} 个匹配的产品
                </div>
              )}
            </>
          )}

          {/* 产品网格 */}
          {showSearch && hasSearched ? (
            // 已执行搜索，显示搜索结果
            filteredProducts.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onImageClick={(image) => handleImageClick(image, product.title)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-lg text-orange-600">未找到匹配的产品</p>
                <p className="mt-2 text-sm text-orange-400">
                  请尝试其他搜索关键词
                </p>
              </div>
            )
          ) : (
            // 未执行搜索或禁用搜索，显示所有产品
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onImageClick={(image) => handleImageClick(image, product.title)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      <ImageModal
        image={selectedImage}
        alt={selectedAlt}
        onClose={handleCloseModal}
      />
    </>
  );
}

