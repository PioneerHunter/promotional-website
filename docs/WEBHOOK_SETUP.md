# GitHub Webhook 自动部署配置指南

## 概述

本项目支持通过 GitHub Webhook 自动触发 Docker 部署。当代码推送到 `master` 分支时，会自动执行部署脚本。

## 配置步骤

### 1. 生成 Webhook Secret

在服务器上生成一个安全的密钥：

```bash
openssl rand -hex 32
```

保存这个密钥，稍后会在 GitHub 和服务器配置中使用。

### 2. 配置服务器环境变量

在服务器上创建或编辑 `.env` 文件（或设置系统环境变量）：

```bash
# 在项目根目录或服务器环境变量中设置
export GITHUB_WEBHOOK_SECRET=your_generated_secret_here
```

如果使用 PM2，可以在 `ecosystem.config.js` 中设置：

```javascript
env: {
  GITHUB_WEBHOOK_SECRET: 'your_generated_secret_here',
}
```

### 3. 配置 GitHub Webhook

1. 进入 GitHub 仓库
2. 点击 **Settings** → **Webhooks** → **Add webhook**
3. 配置以下信息：
   - **Payload URL**: `https://your-domain.com/api/webhook/deploy`
   - **Content type**: `application/json`
   - **Secret**: 使用步骤 1 生成的密钥
   - **Events**: 选择 "Just the push event"
   - 勾选 "Active"
4. 点击 **Add webhook**

### 4. 配置服务器权限

确保部署脚本有执行权限：

```bash
chmod +x scripts/deploy.sh
```

确保脚本中的项目路径正确（修改 `scripts/deploy.sh` 中的 `PROJECT_DIR`）。

### 5. 测试 Webhook

#### 方法 1: 使用 curl 测试

```bash
# 生成测试 payload
PAYLOAD='{"ref":"refs/heads/master","repository":{"name":"your-repo"},"head_commit":{"id":"test"}}'

# 生成签名
SECRET="your_webhook_secret"
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" | sed 's/^.* //')
SIGNATURE="sha256=$SIGNATURE"

# 发送请求
curl -X POST http://localhost:3000/api/webhook/deploy \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: $SIGNATURE" \
  -d "$PAYLOAD"
```

#### 方法 2: 在 GitHub 中测试

1. 在 Webhook 配置页面，点击 "Recent Deliveries"
2. 查看最近的请求是否成功
3. 检查服务器日志

### 6. 验证部署

推送代码到 `master` 分支后：

1. 检查 Webhook 是否触发（GitHub Webhook 页面）
2. 检查服务器日志
3. 验证容器是否更新：

```bash
docker compose ps
docker compose logs frontend
```

## 部署脚本说明

`scripts/deploy.sh` 执行以下步骤：

1. 拉取最新代码
2. 停止现有容器
3. 构建新镜像
4. 启动容器
5. 清理未使用的镜像

## 安全注意事项

1. **Webhook Secret**: 必须使用强密钥，不要泄露
2. **HTTPS**: 生产环境必须使用 HTTPS
3. **IP 白名单**: 可以配置 Nginx 限制访问来源
4. **日志**: 定期检查部署日志，确保安全

## 故障排查

### Webhook 未触发

1. 检查 GitHub Webhook 配置是否正确
2. 检查服务器是否可访问（防火墙、Nginx 配置）
3. 查看 GitHub Webhook 的 "Recent Deliveries" 页面

### 部署失败

1. 检查部署脚本权限：`ls -l scripts/deploy.sh`
2. 检查 Docker 是否运行：`docker ps`
3. 查看部署日志：`docker compose logs`
4. 手动执行部署脚本测试：`bash scripts/deploy.sh`

### 签名验证失败

1. 确认 `GITHUB_WEBHOOK_SECRET` 环境变量已设置
2. 确认 GitHub Webhook 中的 Secret 与服务器环境变量一致
3. 检查请求头是否正确传递

## Nginx 配置示例

如果需要通过 Nginx 代理 Webhook 请求：

```nginx
location /api/webhook/deploy {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # 传递原始请求体（重要）
    proxy_set_header Content-Length $content_length;
    proxy_set_header Content-Type $content_type;
    proxy_pass_request_body on;
    
    # 超时设置
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}
```

## 高级配置

### 限制特定分支

修改 `app/api/webhook/deploy/route.ts` 中的分支检查逻辑。

### 添加部署通知

可以在部署脚本中添加通知功能（如发送邮件、Slack 消息等）。

### 回滚功能

可以添加回滚脚本，在部署失败时自动回滚到上一个版本。

