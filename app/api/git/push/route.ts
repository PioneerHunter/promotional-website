import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// POST /api/git/push - 自动执行 git add, commit, push
export async function POST() {
  // 只在开发环境允许
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: '此功能仅在开发环境可用' },
      { status: 403 }
    );
  }

  try {
    const cwd = process.cwd();

    // 格式化时间：年月日时分秒
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');

    const commitMessage = `【feat: 上传，${year}年${month}月${day}日${hour}时${minute}分${second}秒】`;

    // 1. git add .
    console.log('执行 git add .');
    await execAsync('git add .', { cwd });

    // 2. git commit
    console.log(`执行 git commit: ${commitMessage}`);
    try {
      await execAsync(`git commit -m "${commitMessage}"`, { cwd });
    } catch (commitError: any) {
      // 如果没有变更需要提交，跳过 commit
      if (commitError.message?.includes('nothing to commit') ||
        commitError.stderr?.includes('nothing to commit')) {
        console.log('没有需要提交的变更，跳过 commit');
      } else {
        throw commitError;
      }
    }

    // 3. git push
    console.log('执行 git push origin master');
    const { stdout, stderr } = await execAsync('git push origin master', { cwd });

    return NextResponse.json({
      success: true,
      message: '代码已成功推送到远程仓库',
      commitMessage,
      output: stdout,
    });
  } catch (error: any) {
    console.error('Git 操作失败:', error);

    return NextResponse.json({
      success: false,
      error: error.message || 'Git 操作失败',
      stderr: error.stderr || '',
    }, { status: 500 });
  }
}

