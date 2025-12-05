# GitHub Actions 自动部署配置指南

## 概述

本项目使用 GitHub Actions 自动触发服务器上的 Docker 构建部署。当代码推送到 `master` 分支时，会自动在服务器上执行部署脚本。

## 配置步骤

### 1. 生成 SSH 密钥对

在本地或服务器上生成专用的 SSH 密钥：

```bash
# 生成 SSH 密钥（如果还没有）
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy

# 查看公钥（需要添加到服务器）
cat ~/.ssh/github_actions_deploy.pub

# 查看私钥（需要添加到 GitHub Secrets）
cat ~/.ssh/github_actions_deploy
```

### 2. 将公钥添加到服务器

在服务器上执行：

```bash
# 将公钥添加到 authorized_keys
mkdir -p ~/.ssh
echo "你的公钥内容" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

# 测试 SSH 连接（从本地）
ssh -i ~/.ssh/github_actions_deploy user@your-server-ip
```

### 3. 配置 GitHub Secrets

1. 进入 GitHub 仓库
2. 点击 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 添加以下 Secrets：

#### 必需的 Secrets

- **SERVER_HOST**: 服务器 IP 地址或域名
  - 示例：`your-domain.com`

- **SERVER_USER**: SSH 用户名
  - 示例：`root` 或 `ubuntu`

- **SERVER_SSH_KEY**: SSH 私钥内容
  - 复制整个私钥文件内容（包括 `-----BEGIN OPENSSH PRIVATE KEY-----` 和 `-----END OPENSSH PRIVATE KEY-----`）

#### 可选的 Secrets

- **SERVER_PORT**: SSH 端口（默认 22）
  - 如果使用非标准端口，设置此值

### 4. 测试部署

#### 方法 1: 推送代码自动触发

```bash
# 推送代码到 master 分支
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions deployment"
git push origin master
```

#### 方法 2: 手动触发

1. 进入 GitHub 仓库 → **Actions** 标签
2. 选择 **Deploy to Server** 工作流
3. 点击 **Run workflow**
4. 选择分支并运行

### 5. 查看部署状态

1. 进入 GitHub 仓库 → **Actions**
2. 查看最新的工作流运行
3. 点击查看详细日志和输出

## 工作流程

```
GitHub 推送代码
    ↓
GitHub Actions 触发
    ↓
SSH 连接到服务器
    ↓
拉取最新代码
    ↓
执行 scripts/deploy.sh
    ↓
Docker 构建和部署
    ↓
部署完成
```

## 部署脚本说明

GitHub Actions 会执行服务器上的 `scripts/deploy.sh` 脚本，该脚本会：

1. 拉取最新代码
2. 停止现有容器
3. 构建新镜像
4. 启动容器
5. 清理旧镜像

## 查看部署日志

### 在 GitHub 中查看

- 进入 **Actions** → 选择工作流运行 → 查看日志

### 在服务器上查看

```bash
# 查看部署日志
tail -f /app/promotional-website/logs/deploy-latest.log

# 查看容器状态
docker compose ps
```

## 故障排查

### 问题 1: SSH 连接失败

**错误**: `Permission denied (publickey)`

**解决**:
1. 检查 SSH 密钥是否正确添加到服务器
2. 检查 `SERVER_USER` 是否正确
3. 测试 SSH 连接：`ssh -i ~/.ssh/github_actions_deploy user@server`

### 问题 2: 找不到部署脚本

**错误**: `scripts/deploy.sh: No such file or directory`

**解决**:
1. 检查服务器上的项目路径是否正确
2. 确认 `scripts/deploy.sh` 文件存在
3. 检查脚本权限：`chmod +x scripts/deploy.sh`

### 问题 3: Docker 命令失败

**错误**: `docker: command not found`

**解决**:
1. 确保服务器上已安装 Docker
2. 检查用户是否有 Docker 权限
3. 可能需要将用户添加到 docker 组：`sudo usermod -aG docker $USER`

### 问题 4: Git 操作失败

**错误**: `git: command not found` 或权限错误

**解决**:
1. 确保服务器上已安装 Git
2. 检查 Git 仓库权限
3. 确保可以访问远程仓库

## 安全建议

1. **使用专用 SSH 密钥**：不要使用主 SSH 密钥
2. **限制密钥权限**：只给必要的权限
3. **定期轮换密钥**：定期更新 SSH 密钥
4. **使用非 root 用户**：如果可能，使用非 root 用户部署
5. **限制 SSH 访问**：在服务器上限制 SSH 访问 IP

## 高级配置

### 多环境部署

可以配置多个工作流，分别部署到不同环境：

```yaml
# .github/workflows/deploy-staging.yml
# .github/workflows/deploy-production.yml
```

### 添加通知

可以在部署成功/失败时发送通知：

```yaml
- name: Notify on success
  if: success()
  run: |
    # 发送通知（邮件、Slack 等）
```

### 部署前检查

可以添加部署前的检查步骤：

```yaml
- name: Run tests
  run: |
    # 运行测试
```

## 与现有 Webhook 的关系

- **GitHub Actions**: 主要部署方式（推荐）
- **GitHub Webhook**: 可以作为备用或特殊场景使用

两者可以共存，互不影响。

## 总结

GitHub Actions 的优势：
- ✅ 无需服务器配置 Webhook
- ✅ 完整的构建和部署日志
- ✅ 支持手动触发
- ✅ 不依赖容器环境
- ✅ 更安全（SSH 密钥管理）

配置完成后，每次推送到 `master` 分支都会自动触发部署。

