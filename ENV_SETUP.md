# 环境变量配置

## GitHub Webhook 配置

在服务器上设置以下环境变量：

```bash
# GitHub Webhook Secret（在 GitHub 仓库设置中生成）
export GITHUB_WEBHOOK_SECRET=your_webhook_secret_here
```

### 生成 Webhook Secret

```bash
openssl rand -hex 32
```

### 在 PM2 中配置

编辑 `ecosystem.config.js`：

```javascript
env: {
  GITHUB_WEBHOOK_SECRET: 'your_webhook_secret_here',
  NODE_ENV: 'production',
  PORT: 3000,
}
```

### 在 Docker 中配置

编辑 `docker-compose.yml`，添加环境变量：

```yaml
services:
  frontend:
    environment:
      - GITHUB_WEBHOOK_SECRET=${GITHUB_WEBHOOK_SECRET}
      - NODE_ENV=production
      - PORT=3000
```

或在 `.env` 文件中设置（不要提交到 Git）。

