"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import ImageModal from "./ImageModal";
import type { Product } from "../types";

type ProductsProps = {
  products: Product[];
};

export default function Products({ products }: ProductsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedAlt, setSelectedAlt] = useState("");

  const handleImageClick = (image: string, alt: string) => {
    setSelectedImage(image);
    setSelectedAlt(alt);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setSelectedAlt("");
  };

  return (
    <>
      <section className="bg-gradient-to-b from-yellow-50 via-orange-50 to-pink-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onImageClick={(image) => handleImageClick(image, product.title)}
              />
            ))}
          </div>
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

