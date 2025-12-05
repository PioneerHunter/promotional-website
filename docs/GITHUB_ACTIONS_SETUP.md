# GitHub Actions 自动部署快速指南

## 快速配置（3 步）

### 1. 生成 SSH 密钥

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions
```

### 2. 添加公钥到服务器

```bash
# 复制公钥
cat ~/.ssh/github_actions.pub

# 在服务器上执行
echo "你的公钥" >> ~/.ssh/authorized_keys

# 查看私钥（需要添加到 GitHub Secrets）
cat ~/.ssh/github_actions

# 测试 SSH 连接（从本地）
ssh -i ~/.ssh/github_actions user@22.3.43.0 // 示例：root@22.3.43.0
```

### 3. 配置 GitHub Secrets

进入 GitHub 仓库 → Settings → Secrets and variables → Actions → New repository secret

添加：
- **SERVER_HOST**: 服务器 IP 地址或域名
  - 示例：`your-domain.com`

- **SERVER_USER**: SSH 用户名
  - 示例：`root` 或 `ubuntu`

- **SERVER_SSH_KEY**: SSH 私钥内容
  - 复制整个私钥文件内容（包括 `-----BEGIN OPENSSH PRIVATE KEY-----` 和 `-----END OPENSSH PRIVATE KEY-----`）
- **SERVER_PORT**(kexuan ): SSH 端口（默认 22）
  - 如果使用非标准端口，设置此值

## 使用

### 自动触发
推送代码到 `master` 分支即可自动部署

### 手动触发
GitHub 仓库 → Actions → Deploy to Server → Run workflow

## 查看日志

- GitHub: Actions → 选择运行 → 查看日志
- 服务器: `tail -f /app/promotional-website/logs/deploy-latest.log`

## 详细文档

查看 [docs/GITHUB_ACTIONS_SETUP.md](./docs/GITHUB_ACTIONS_SETUP.md)

