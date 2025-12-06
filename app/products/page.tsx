import Navigation from "../components/Navigation";
import Products from "../components/Products";
import { getProducts } from "../lib/products";

export default async function ProductsPage() {
  // 获取所有产品（不过滤）
  const allProducts = await getProducts();

  return (
    <div className="min-h-screen">
      <Navigation />
      <Products products={allProducts} />
    </div>
  );
}

