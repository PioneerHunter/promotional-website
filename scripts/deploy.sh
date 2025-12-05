#!/bin/bash

# Docker 自动部署脚本
# 用于 GitHub Webhook 触发部署

set -e  # 遇到错误立即退出

# 日志文件路径
LOG_DIR="/app/promotional-website/logs"
LOG_FILE="$LOG_DIR/deploy-$(date +%Y%m%d-%H%M%S).log"

# 确保日志目录存在
mkdir -p "$LOG_DIR"

# 同时输出到终端和日志文件
exec > >(tee -a "$LOG_FILE") 2>&1

echo "=========================================="
echo "开始自动部署..."
echo "时间: $(date)"
echo "日志文件: $LOG_FILE"
echo "=========================================="

# 项目目录（根据实际情况修改）
PROJECT_DIR="/app/promotional-website"
cd "$PROJECT_DIR" || exit 1

# 拉取最新代码
echo "1. 拉取最新代码..."
git fetch origin
git reset --hard origin/master

# 停止现有容器
echo "2. 停止现有容器..."
docker compose down || true

# 构建新镜像
echo "3. 构建新镜像..."
docker compose build

# 启动容器
echo "4. 启动容器..."
docker compose up -d

# 清理旧镜像（可选）
echo "5. 清理未使用的镜像..."
docker image prune -f || true

echo "=========================================="
echo "部署完成！"
echo "时间: $(date)"
echo "日志文件: $LOG_FILE"
echo "=========================================="

# 显示容器状态
docker compose ps

# 创建最新的日志链接（方便查看）
ln -sf "$LOG_FILE" "$LOG_DIR/deploy-latest.log"

