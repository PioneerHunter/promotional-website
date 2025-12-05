# GitHub Webhook 自动部署快速指南

## 快速开始

### 1. 生成 Webhook Secret

```bash
openssl rand -hex 32
```

### 2. 配置服务器环境变量

在服务器上设置环境变量：

```bash
export GITHUB_WEBHOOK_SECRET=your_generated_secret_here
```

### 3. 配置 GitHub Webhook

1. 进入 GitHub 仓库 → Settings → Webhooks → Add webhook
2. 配置：
   - **Payload URL**: `https://your-domain.com/api/webhook/deploy`
   - **Content type**: `application/json`
   - **Secret**: 步骤 1 生成的密钥
   - **Events**: 选择 "Just the push event"
3. 保存

### 4. 修改部署脚本路径

编辑 `scripts/deploy.sh`，修改 `PROJECT_DIR` 为你的实际项目路径：

```bash
PROJECT_DIR="/app/promotional-website"  # 修改为你的路径
```

### 5. 测试

推送代码到 `master` 分支，检查部署是否自动触发。

## 文件说明

- `app/api/webhook/deploy/route.ts` - Webhook 接收端点
- `scripts/deploy.sh` - 自动部署脚本
- `scripts/webhook-test.sh` - 测试脚本
- `docs/WEBHOOK_SETUP.md` - 详细配置文档

## 详细文档

查看 [docs/WEBHOOK_SETUP.md](./docs/WEBHOOK_SETUP.md) 获取完整配置说明。

