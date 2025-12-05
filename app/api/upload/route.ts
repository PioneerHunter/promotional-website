import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

// POST /api/upload - 上传图片
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 生成文件名
    const timestamp = Date.now();
    const originalName = file.name;
    const ext = path.extname(originalName);
    const fileName = `product-${timestamp}${ext}`;
    const filePath = path.join(process.cwd(), 'public', 'products', fileName);

    // 保存文件
    await writeFile(filePath, buffer);

    // 返回文件路径
    const imageUrl = `/products/${fileName}`;
    return NextResponse.json({ url: imageUrl, fileName });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

