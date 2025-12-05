import { NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

// GET /api/webhook/logs - 获取部署日志列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const logFile = searchParams.get('file');
    const logsDir = join(process.cwd(), 'logs');

    // 如果指定了文件，返回文件内容
    if (logFile) {
      try {
        const filePath = join(logsDir, logFile);
        const content = await readFile(filePath, 'utf-8');
        return NextResponse.json({
          success: true,
          file: logFile,
          content,
        });
      } catch (error) {
        return NextResponse.json(
          { error: 'Log file not found' },
          { status: 404 }
        );
      }
    }

    // 返回日志文件列表
    try {
      const files = await readdir(logsDir);
      const logFiles = files
        .filter((file) => file.startsWith('deploy-') && file.endsWith('.log'))
        .sort()
        .reverse(); // 最新的在前

      return NextResponse.json({
        success: true,
        logs: logFiles,
        latest: logFiles[0] || null,
      });
    } catch (error) {
      return NextResponse.json({
        success: true,
        logs: [],
        latest: null,
      });
    }
  } catch (error) {
    console.error('Error reading logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

