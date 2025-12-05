import { promises as fs } from 'fs';
import path from 'path';
import type { Product } from '../types';

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'products');

// 确保目录存在
export async function ensureDirectories() {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.mkdir(IMAGES_DIR, { recursive: true });
}

// 读取所有产品
export async function getProducts(): Promise<Product[]> {
  try {
    await ensureDirectories();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // 如果文件不存在，返回空数组
    return [];
  }
}

// 保存产品列表
export async function saveProducts(products: Product[]): Promise<void> {
  await ensureDirectories();
  await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), 'utf-8');
}

// 根据 ID 获取产品
export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find(p => p.id === id) || null;
}

// 创建产品
export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const products = await getProducts();
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
  };
  products.push(newProduct);
  await saveProducts(products);
  return newProduct;
}

// 更新产品
export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const products = await getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;

  products[index] = { ...products[index], ...updates };
  await saveProducts(products);
  return products[index];
}

// 删除产品
export async function deleteProduct(id: string): Promise<boolean> {
  const products = await getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return false;

  // 删除关联的图片文件
  const product = products[index];
  if (product.image && product.image.startsWith('/products/')) {
    const imagePath = path.join(process.cwd(), 'public', product.image);
    try {
      // 检查文件是否存在
      await fs.access(imagePath);
      await fs.unlink(imagePath);
      console.log('Deleted image:', imagePath);
    } catch (error: any) {
      // 文件不存在或其他错误，继续删除产品数据
      if (error.code !== 'ENOENT') {
        console.error('Failed to delete image:', error);
      }
    }
  }

  products.splice(index, 1);
  await saveProducts(products);
  return true;
}

