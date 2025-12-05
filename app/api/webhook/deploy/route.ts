import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import crypto from 'crypto';
import path from 'path';

const execAsync = promisify(exec);

// 验证 GitHub Webhook 签名
function verifySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  if (!signature || !secret) {
    return false;
  }

  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

// POST /api/webhook/deploy - 接收 GitHub Webhook
export async function POST(request: Request) {
  try {
    // 获取 Webhook 密钥（从环境变量）
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('GITHUB_WEBHOOK_SECRET 未配置');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // 获取签名
    const signature = request.headers.get('x-hub-signature-256') ||
      request.headers.get('x-hub-signature') || '';

    // 读取请求体
    const body = await request.text();

    // 验证签名
    if (!verifySignature(body, signature, webhookSecret)) {
      console.error('Webhook 签名验证失败');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // 解析 JSON
    const payload = JSON.parse(body);

    // 只处理 push 事件到 master 分支
    const ref = payload.ref || '';
    const branch = ref.replace('refs/heads/', '');

    if (payload.repository && branch === 'master') {
      console.log(`收到 push 事件，分支: ${branch}`);

      // 异步执行部署脚本（不阻塞响应）
      const deployScript = path.join(process.cwd(), 'scripts', 'deploy.sh');

      // 在后台执行部署，捕获输出
      execAsync(`bash ${deployScript}`, {
        cwd: process.cwd(),
        env: {
          ...process.env,
          PATH: process.env.PATH || '',
        },
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
      })
        .then(({ stdout, stderr }) => {
          console.log('部署脚本输出:', stdout);
          if (stderr) {
            console.error('部署脚本错误:', stderr);
          }
        })
        .catch((error) => {
          console.error('部署脚本执行失败:', error);
          if (error.stdout) console.error('标准输出:', error.stdout);
          if (error.stderr) console.error('错误输出:', error.stderr);
        });

      return NextResponse.json({
        success: true,
        message: '部署已触发',
        branch,
        commit: payload.head_commit?.id || 'unknown',
      });
    }

    // 不是目标分支，忽略
    return NextResponse.json({
      success: true,
      message: '事件已接收，但不是目标分支',
      branch,
    });

  } catch (error) {
    console.error('Webhook 处理错误:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/webhook/deploy - 健康检查
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Webhook endpoint is ready',
    timestamp: new Date().toISOString(),
  });
}

